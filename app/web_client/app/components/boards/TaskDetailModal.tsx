import React, { useState, useEffect } from 'react';
import { Task } from './TaskCard';
import { getTask, updateTask, deleteTask, getParticipants, assignUser, unassignUser, getBoard } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface DetailedTask extends Task {
    creatorName?: string;
    assignees: { id: string; name: string }[];
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
    const [isEditing, setIsEditing] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);
    
    // Columns
    const [columns, setColumns] = useState<{id: string, columnName: string}[]>([]);
    const [selectedColumn, setSelectedColumn] = useState(columnId || '');

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('None');

    useEffect(() => {
        if (!taskId) return;
        setLoading(true);
        Promise.all([
            getTask(taskId),
            boardId ? getParticipants(boardId) : Promise.resolve([]),
            boardId ? getBoard(boardId) : Promise.resolve(null)
        ]).then(([taskData, parts, boardData]) => {
            const detailed = { ...taskData, assignees: taskData.assignees || [] } as DetailedTask;
            setTask(detailed);
            setTaskName(detailed.taskName);
            setDescription(detailed.description || '');
            setPriority(detailed.priority || 'None');
            setParticipants(parts);
            if(boardData) setColumns(boardData.columns);
            setLoading(false);
        }).catch(console.error);
    }, [taskId, boardId]);

    const handleSave = async () => {
        if (!task) return;
        
        const updates: any = { taskName, description, priority: priority as any };
        const columnChanged = selectedColumn && selectedColumn !== columnId;
        
        if (columnChanged) {
            updates.boardColumnId = parseInt(selectedColumn);
        }

        const response = await updateTask(task.id, updates);
        const updatedTask = { ...response, assignees: (response as any).assignees || [] } as DetailedTask;
        
        setTask(updatedTask);
        setIsEditing(false);

        if (columnChanged) {
            onClose();
            onMove();
        } else {
            onUpdate(updatedTask);
        }
    };

    const handleAssign = async (userId: string) => {
        if (!task || !userId) return;
        await assignUser(task.id, userId, 'task');
        const userToAssign = participants.find(p => p.participantUserId == userId) 
                             || (user?.id == userId ? { name: user.username || user.email } : null);

        const currentAssignees = task.assignees || [];
        if (userToAssign && !currentAssignees.some(a => a.id == userId)) {
            const updatedTask = { 
                ...task, 
                assignees: [...currentAssignees, { id: userId, name: userToAssign.name }] 
            };
            setTask(updatedTask);
            onUpdate(updatedTask);
        }
    };

    const handleUnassign = async (userId: string) => {
        if (!task) return;
        await unassignUser(task.id, userId, 'task');
        const updatedTask = { 
            ...task, 
            assignees: (task.assignees || []).filter(a => a.id != userId) 
        };
        setTask(updatedTask);
        onUpdate(updatedTask);
    };

    if (loading || !task) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <div className="edit-mode">
                        <h2>Edit Task</h2>
                        <label style={{fontSize: '0.8em', fontWeight: 'bold'}}>Move to:</label>
                        <select 
                            value={selectedColumn} 
                            onChange={e => setSelectedColumn(e.target.value)}
                            style={{width: '100%', marginBottom: '15px', padding: '8px'}}
                        >
                            {columns.map(col => (
                                <option key={col.id} value={col.id}>{col.columnName}</option>
                            ))}
                        </select>

                        <input value={taskName} onChange={e => setTaskName(e.target.value)} className="title-input" placeholder="Title" />
                        <select value={priority} onChange={e => setPriority(e.target.value)}>
                            <option value="None">Priority: None</option>
                            <option value="P0">P0 (Urgent)</option>
                            <option value="P1">P1 (High)</option>
                            <option value="P2">P2 (Normal)</option>
                        </select>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Description" />
                        <div className="modal-actions">
                            <button onClick={handleSave} style={{background: '#4CAF50', color: 'white'}}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="view-mode">
                        <h2>{task.taskName} <span className="badge">{task.priority}</span></h2>
                        <div style={{fontSize: '0.8em', color: '#888', marginBottom: '10px'}}>Created by: {task.creatorName}</div>
                        
                        <div className="assignees-section" style={{marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '8px'}}>
                            <strong>Assignees: </strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                                {(task.assignees || []).map((u) => (
                                    <span key={u.id} style={{background: '#0070f3', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85em'}}>
                                        {u.name} 
                                        <span onClick={() => handleUnassign(u.id)} style={{cursor:'pointer', marginLeft:'8px', fontWeight:'bold'}}>×</span>
                                    </span>
                                ))}
                            </div>
                            <div style={{marginTop: '10px', display: 'flex', gap: '5px'}}>
                                <select onChange={(e) => handleAssign(e.target.value)} value="" style={{flex: 1}}>
                                    <option value="">+ Add member</option>
                                    {participants.map(p => (
                                        <option key={p.participantUserId} value={p.participantUserId}>{p.name}</option>
                                    ))}
                                </select>
                                {user && !(task.assignees || []).some(a => a.id == user.id) && (
                                    <button onClick={() => handleAssign(user.id.toString())} style={{fontSize: '0.8em'}}>Me</button>
                                )}
                            </div>
                        </div>

                        <p className="desc">{task.description || "No description provided."}</p>
                        
                        <div className="modal-actions">
                            <button onClick={() => setIsEditing(true)}>Edit / Move</button>
                            <button className="delete-btn" onClick={() => { if(confirm("Delete this task?")) { deleteTask(task.id).then(() => { onDelete(task.id); onClose(); }); } }}>Delete</button>
                            <button onClick={onClose}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal;