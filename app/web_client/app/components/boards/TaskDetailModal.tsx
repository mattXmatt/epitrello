import React, { useState, useEffect } from 'react';
import { Task } from './TaskCard';
import { 
    getTask, updateTask, deleteTask, getParticipants, assignUser, unassignUser, 
    getBoard, createTag, getBoardTags, assignTag, unassignTag, addComment, deleteComment, Tag 
} from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    userName: string;
    userId: string;
}

interface DetailedTask extends Task {
    creatorName?: string;
    assignees: { id: string; name: string }[];
    tags: Tag[];
    comments: Comment[];
    dueDate?: string;
}

interface TaskDetailModalProps {
    taskId: string;
    boardId?: string;
    columnId?: string;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
    onDelete: (taskId: string) => void;
    onMove: () => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, boardId, columnId, onClose, onUpdate, onDelete, onMove }) => {
    const { user } = useAuth();
    const [task, setTask] = useState<DetailedTask | null>(null);
    const [loading, setLoading] = useState(true);
    const [participants, setParticipants] = useState<any[]>([]);
    
    const [columns, setColumns] = useState<{id: string, columnName: string}[]>([]);
    
    // Valeurs éditables en direct
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('None');
    const [dueDate, setDueDate] = useState('');
    const [selectedColumn, setSelectedColumn] = useState(columnId || '');
    
    const [newComment, setNewComment] = useState('');
    const [availableTags, setAvailableTags] = useState<Tag[]>([]);
    const [newTagName, setNewTagName] = useState('');
    const [newTagColor, setNewTagColor] = useState('#61bd4f');
    const [showTagInput, setShowTagInput] = useState(false);

    const formatDateForInput = (isoDate: string | undefined) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return d.toISOString().split('T')[0];
    };

    useEffect(() => {
        if (!taskId) return;
        setLoading(true);
        
        Promise.all([
            getTask(taskId).catch(() => null),
            boardId ? getParticipants(boardId).catch(() => []) : Promise.resolve([]),
            boardId ? getBoard(boardId).catch(() => null) : Promise.resolve(null),
            boardId ? getBoardTags(boardId).catch(() => []) : Promise.resolve([])
        ]).then(([taskData, parts, boardData, tagsData]) => {
            if (!taskData) {
                setLoading(false);
                return; 
            }

            const detailed = { 
                ...taskData, 
                assignees: taskData.assignees || [], 
                tags: (taskData as any).tags || [],
                comments: (taskData as any).comments || []
            } as DetailedTask;
            
            setTask(detailed);
            setTaskName(detailed.taskName || '');
            setDescription(detailed.description || '');
            setPriority(detailed.priority || 'None');
            setDueDate(formatDateForInput(detailed.dueDate));
            setParticipants(parts || []);
            if(boardData) setColumns(boardData.columns || []);
            setAvailableTags(tagsData || []);
            setLoading(false);
        }).catch((err) => {
            console.error("Modal error:", err);
            setLoading(false);
        });
    }, [taskId, boardId]);

    const handleSave = async () => {
        if (!task) return;
        
        const updates: any = { 
            taskName, 
            description, 
            priority: priority as any,
            dueDate: dueDate ? new Date(dueDate).toISOString() : null 
        };
        
        const columnChanged = selectedColumn && selectedColumn !== columnId;
        if (columnChanged) updates.boardColumnId = parseInt(selectedColumn);

        const response = await updateTask(task.id, updates);
        const updatedTask = { 
            ...response, 
            assignees: (response as any).assignees || [], 
            tags: task.tags, 
            comments: task.comments 
        } as DetailedTask;
        
        setTask(updatedTask);
        
        if (columnChanged) {
            onClose();
            onMove();
        } else {
            onUpdate(updatedTask);
            onClose(); // Ferme la modale après la sauvegarde pour plus de fluidité
        }
    };

    const handleAssign = async (userId: string) => {
        if (!task || !userId) return;
        await assignUser(task.id, userId, 'task');
        const userToAssign = participants.find(p => p.participantUserId == userId) 
                             || (user?.id == userId ? { name: user.username || user.email } : null);

        const currentAssignees = task.assignees || [];
        if (userToAssign && !currentAssignees.some(a => a.id == userId)) {
            const updatedTask = { ...task, assignees: [...currentAssignees, { id: userId, name: userToAssign.name }] };
            setTask(updatedTask);
            onUpdate(updatedTask);
        }
    };

    const handleUnassign = async (userId: string) => {
        if (!task) return;
        await unassignUser(task.id, userId, 'task');
        const updatedTask = { ...task, assignees: (task.assignees || []).filter(a => a.id != userId) };
        setTask(updatedTask);
        onUpdate(updatedTask);
    };

    const handleAddComment = async () => {
        if (!newComment.trim() || !task) return;
        const res = await addComment(task.id, 'task', newComment);
        if (res.success) {
            const updatedTask = { ...task, comments: [...task.comments, res.result] };
            setTask(updatedTask);
            setNewComment('');
        }
    };

    const handleDeleteComment = async (commentId: string) => {
        await deleteComment(commentId);
        if (task) {
            setTask({ ...task, comments: task.comments.filter(c => c.id !== commentId) });
        }
    };

    const handleAddTag = async (tagId: string) => {
        if(!task) return;
        await assignTag(task.id, tagId, 'task');
        const tagToAdd = availableTags.find(t => t.id == tagId);
        if(tagToAdd && !task.tags.some(t => t.id == tagId)) {
            const updated = { ...task, tags: [...task.tags, tagToAdd] };
            setTask(updated);
            onUpdate(updated);
        }
    };

    const handleRemoveTag = async (tagId: string) => {
        if(!task) return;
        await unassignTag(task.id, tagId, 'task');
        const updated = { ...task, tags: task.tags.filter(t => t.id != tagId) };
        setTask(updated);
        onUpdate(updated);
    };

    const handleCreateTag = async () => {
        if(!boardId || !newTagName) return;
        const result = await createTag(boardId, newTagName, newTagColor);
        if(result.success) {
            setAvailableTags(prev => [...prev, result.result]);
            handleAddTag(result.result.id);
            setNewTagName('');
            setShowTagInput(false);
        }
    };

    if (loading) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;
    if (!task) return <div className="modal-overlay" onClick={onClose}><div className="modal-content">Failed to load task.</div></div>;

    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    const inlineInputStyle: React.CSSProperties = {
        width: '100%', border: '1px solid transparent', borderRadius: '4px', padding: '8px', 
        fontSize: 'inherit', fontFamily: 'inherit', backgroundColor: 'transparent', transition: 'all 0.2s'
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px' }}>
                
                <input 
                    value={taskName} 
                    onChange={e => setTaskName(e.target.value)} 
                    placeholder="Task Title"
                    style={{ ...inlineInputStyle, fontSize: '1.5em', fontWeight: 'bold', color: '#172b4d', marginBottom: '5px', padding: '5px 8px' }} 
                    onFocus={e => e.target.style.border = '1px solid #0052cc'}
                    onBlur={e => e.target.style.border = '1px solid transparent'}
                />
                <div style={{fontSize: '0.8em', color: '#888', marginBottom: '20px', paddingLeft: '8px'}}>Created by: {task.creatorName}</div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '20px', padding: '0 8px' }}>
                    <div>
                        <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '4px'}}>IN COLUMN</label>
                        <select value={selectedColumn} onChange={e => setSelectedColumn(e.target.value)} style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #dfe1e6'}}>
                            {columns.map(col => <option key={col.id} value={col.id}>{col.columnName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '4px'}}>PRIORITY</label>
                        <select value={priority} onChange={e => setPriority(e.target.value)} style={{width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid #dfe1e6'}}>
                            <option value="None">None</option>
                            <option value="P0">P0 (Urgent)</option>
                            <option value="P1">P1 (High)</option>
                            <option value="P2">P2 (Normal)</option>
                        </select>
                    </div>
                    <div>
                        <label style={{fontSize: '0.75em', fontWeight: 'bold', color: isOverdue ? '#bf2600' : '#5e6c84', display: 'block', marginBottom: '4px'}}>
                            DUE DATE {isOverdue && "(OVERDUE)"}
                        </label>
                        <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} style={{width: '100%', padding: '5px', borderRadius: '4px', border: '1px solid #dfe1e6', backgroundColor: isOverdue ? '#ffebe6' : 'white', color: isOverdue ? '#bf2600' : 'inherit'}} />
                    </div>
                </div>

                {/* TAGS */}
                <div style={{marginBottom: '20px', paddingLeft: '8px'}}>
                    <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '8px'}}>LABELS</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px'}}>
                        {(task.tags || []).map(tag => (
                            <span key={tag.id} style={{backgroundColor: tag.color, color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85em', display:'flex', alignItems:'center'}}>
                                {tag.name} <span onClick={() => handleRemoveTag(tag.id)} style={{marginLeft:'5px', cursor:'pointer', fontWeight:'bold'}}>×</span>
                            </span>
                        ))}
                        <button onClick={() => setShowTagInput(!showTagInput)} style={{padding:'4px 8px', fontSize:'0.8em', borderRadius: '4px', border: '1px dashed #ccc', cursor: 'pointer', background: 'transparent', color: '#5e6c84'}}>+ Add Label</button>
                    </div>

                    {showTagInput && (
                        <div style={{background: '#f4f5f7', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', marginTop: '10px'}}>
                            <p style={{margin:'0 0 5px 0', fontWeight:'bold', fontSize:'0.9em'}}>Select or Create:</p>
                            <div style={{display:'flex', flexWrap:'wrap', gap:'5px', marginBottom:'10px'}}>
                                {availableTags.map(tag => (
                                    <span key={tag.id} onClick={() => handleAddTag(tag.id)} style={{backgroundColor: tag.color, color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.8em', cursor:'pointer', opacity: 0.9}}>
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                            <div style={{display:'flex', gap:'5px'}}>
                                <input value={newTagName} onChange={e => setNewTagName(e.target.value)} placeholder="New tag name" style={{flex:1, padding:'6px', borderRadius: '4px', border: '1px solid #ccc'}} />
                                <input type="color" value={newTagColor} onChange={e => setNewTagColor(e.target.value)} style={{width:'35px', height:'35px', padding:0, border:'none', cursor: 'pointer'}} />
                                <button onClick={handleCreateTag} style={{background:'#0052cc', color:'white', border: 'none', borderRadius: '4px', padding: '0 15px', cursor: 'pointer'}}>Add</button>
                            </div>
                        </div>
                    )}
                </div>

                {/* ASSIGNEES */}
                <div style={{marginBottom: '20px', paddingLeft: '8px'}}>
                    <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '8px'}}>MEMBERS</label>
                    <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center'}}>
                        {(task.assignees || []).map(a => (
                            <span key={a.id} style={{background: '#dfe1e6', color: '#172b4d', padding: '6px 12px', borderRadius: '20px', fontSize: '0.85em', display: 'flex', alignItems: 'center'}}>
                                {a.name} <span onClick={() => handleUnassign(a.id)} style={{marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold', color: '#5e6c84'}}>×</span>
                            </span>
                        ))}
                        <select onChange={(e) => handleAssign(e.target.value)} value="" style={{padding: '6px', borderRadius: '20px', border: '1px dashed #ccc', background: 'transparent', color: '#5e6c84', fontSize: '0.85em', cursor: 'pointer'}}>
                            <option value="">+ Add member</option>
                            {participants.map(p => <option key={p.participantUserId} value={p.participantUserId}>{p.name}</option>)}
                        </select>
                        {user && !(task.assignees || []).some(a => a.id == user.id) && (
                            <button onClick={() => handleAssign(user.id.toString())} style={{fontSize: '0.85em', padding: '6px 15px', background: '#0052cc', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer'}}>Assign Me</button>
                        )}
                    </div>
                </div>

                {/* DESCRIPTION EDITABLE */}
                <div style={{marginBottom: '20px', paddingLeft: '8px'}}>
                    <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '4px'}}>DESCRIPTION</label>
                    <textarea 
                        value={description} 
                        onChange={e => setDescription(e.target.value)} 
                        placeholder="Add a more detailed description..."
                        rows={4}
                        style={{ ...inlineInputStyle, backgroundColor: '#f4f5f7' }} 
                        onFocus={e => { e.target.style.border = '1px solid #0052cc'; e.target.style.backgroundColor = 'white'; }}
                        onBlur={e => { e.target.style.border = '1px solid transparent'; e.target.style.backgroundColor = '#f4f5f7'; }}
                    />
                </div>
                
                {/* COMMENTS SECTION */}
                <div style={{marginTop: '10px', paddingTop: '20px', paddingLeft: '8px'}}>
                    <label style={{fontSize: '0.75em', fontWeight: 'bold', color: '#5e6c84', display: 'block', marginBottom: '15px'}}>Comments</label>
                    <div style={{display: 'flex', gap: '10px', marginBottom: '20px'}}>
                        <input value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Write a comment..." style={{flex: 1, padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6'}} onKeyDown={e => e.key === 'Enter' && handleAddComment()} />
                        <button onClick={handleAddComment} style={{background: '#0052cc', color: 'white', border: 'none', padding: '0 20px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold'}}>Send</button>
                    </div>

                    <div style={{display: 'flex', flexDirection: 'column', gap: '15px', maxHeight: '200px', overflowY: 'auto', paddingRight: '5px'}}>
                        {(task.comments || []).map(comment => (
                            <div key={comment.id} style={{background: '#ffffff', padding: '12px', borderRadius: '8px', border: '1px solid #ebecf0'}}>
                                <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '4px'}}>
                                    <strong style={{fontSize: '0.85em', color: '#172b4d'}}>{comment.userName}</strong>
                                    <span style={{fontSize: '0.75em', color: '#888'}}>
                                        {new Date(comment.createdAt).toLocaleString()}
                                        {user?.id.toString() === comment.userId.toString() && (
                                            <span onClick={() => handleDeleteComment(comment.id)} style={{color: '#ef4444', marginLeft: '10px', cursor: 'pointer', fontWeight: 'bold'}}>Delete</span>
                                        )}
                                    </span>
                                </div>
                                <p style={{margin: 0, fontSize: '0.9em', color: '#333', whiteSpace: 'pre-wrap'}}>{comment.text}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* ACTION BUTTONS */}
                <div className="modal-actions" style={{marginTop: '30px', display: 'flex', gap: '10px', borderTop: '1px solid #dfe1e6', paddingTop: '15px'}}>
                    <button onClick={handleSave} style={{flex: 1, background: '#0052cc', color: 'white', fontWeight: 'bold'}}>Save Task</button>
                    <button onClick={onClose} style={{padding: '10px 20px', borderRadius: '4px', border: '1px solid #ccc', cursor: 'pointer', background: 'white'}}>Close</button>
                    <button className="delete-btn" style={{background: '#ffebe6', color: '#bf2600', padding: '10px 20px', borderRadius: '4px', border: 'none', cursor: 'pointer'}} onClick={() => { if(confirm("Delete this task?")) { deleteTask(task.id).then(() => { onDelete(task.id); onClose(); }); } }}>Delete</button>
                </div>
            </div>
        </div>
    );
};

export default TaskDetailModal;