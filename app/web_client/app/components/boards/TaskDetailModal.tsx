import React, { useState, useEffect } from 'react';
import { Task } from './TaskCard';
import { getTask, updateTask, deleteTask, getParticipants, assignUser, unassignUser } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface DetailedTask extends Task {
    creatorName?: string;
    assignees: { id: string; name: string }[];
}

interface TaskDetailModalProps {
    taskId: string;
    boardId?: string;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, boardId, onClose, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const [task, setTask] = useState<DetailedTask | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [participants, setParticipants] = useState<any[]>([]);

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('None');

    useEffect(() => {
        if (!taskId) return;
        setLoading(true);
        Promise.all([
            getTask(taskId),
            boardId ? getParticipants(boardId) : Promise.resolve([])
        ]).then(([taskData, parts]) => {
            setTask(taskData as DetailedTask);
            setTaskName(taskData.taskName);
            setDescription(taskData.description || '');
            setPriority(taskData.priority || 'None');
            setParticipants(parts);
            setLoading(false);
        }).catch(console.error);
    }, [taskId, boardId]);

    const handleSave = async () => {
        if (!task) return;
        const response = await updateTask(task.id, { taskName, description, priority: priority as any });
        const updatedTask = response as DetailedTask;
        
        setTask(updatedTask);
        onUpdate(updatedTask);
        setIsEditing(false);
    };

    const handleAssign = async (userId: string) => {
        if (!task || !userId) return;
        await assignUser(task.id, userId, 'task');
        
        const userToAssign = participants.find(p => p.participantUserId == userId) 
                             || (user?.id == userId ? { name: user.username || user.email } : null);

        if (userToAssign && !task.assignees?.some(a => a.id == userId)) {
            const updatedTask = { 
                ...task, 
                assignees: [...(task.assignees || []), { id: userId, name: userToAssign.name }] 
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
            assignees: task.assignees.filter(a => a.id != userId) 
        };
        setTask(updatedTask);
        onUpdate(updatedTask);
    };

    if (loading || !task) return <div className="modal-overlay"><div className="modal-content">Chargement...</div></div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <>
                        <input value={taskName} onChange={e => setTaskName(e.target.value)} className="title-input" />
                        <select value={priority} onChange={e => setPriority(e.target.value)}>
                            <option value="None">Priorité</option>
                            <option value="P0">P0 (Urgent)</option>
                            <option value="P1">P1</option>
                            <option value="P2">P2</option>
                        </select>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} />
                        <div className="modal-actions">
                            <button onClick={handleSave}>Sauvegarder</button>
                            <button onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{task.taskName} <span className="badge">{task.priority}</span></h2>
                        <div style={{fontSize: '0.8em', color: '#888', marginBottom: '10px'}}>Créé par: {task.creatorName}</div>
                        
                        <div className="assignees-section" style={{marginBottom: '20px', padding: '10px', background: '#f5f5f5', borderRadius: '8px'}}>
                            <strong>Responsables: </strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '5px'}}>
                                {task.assignees?.map((u) => (
                                    <span key={u.id} style={{background: '#0070f3', color: 'white', padding: '2px 10px', borderRadius: '20px', fontSize: '0.85em'}}>
                                        {u.name} 
                                        <span onClick={() => handleUnassign(u.id)} style={{cursor:'pointer', marginLeft:'8px', fontWeight:'bold'}}>×</span>
                                    </span>
                                ))}
                            </div>
                            
                            <div style={{marginTop: '10px', display: 'flex', gap: '5px'}}>
                                <select onChange={(e) => handleAssign(e.target.value)} value="" style={{flex: 1}}>
                                    <option value="">+ Ajouter un membre</option>
                                    {participants.map(p => (
                                        <option key={p.participantUserId} value={p.participantUserId}>{p.name}</option>
                                    ))}
                                </select>
                                {user && !task.assignees.some(a => a.id == user.id) && (
                                    <button onClick={() => handleAssign(user.id.toString())} style={{fontSize: '0.8em'}}>Moi</button>
                                )}
                            </div>
                        </div>

                        <p className="desc">{task.description || "Aucune description"}</p>
                        
                        <div className="modal-actions">
                            <button onClick={() => setIsEditing(true)}>Modifier</button>
                            <button className="delete-btn" onClick={() => { if(confirm("Supprimer ?")) { deleteTask(task.id).then(() => { onDelete(task.id); onClose(); }); } }}>Supprimer</button>
                            <button onClick={onClose}>Fermer</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal;