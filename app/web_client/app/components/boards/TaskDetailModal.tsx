import React, { useState, useEffect } from 'react';
import { Task } from './TaskCard';
import { getTask, updateTask, deleteTask } from '@/app/services/api';

interface TaskDetailModalProps {
    taskId: string;
    onClose: () => void;
    onUpdate: (updatedTask: Task) => void;
    onDelete: (taskId: string) => void;
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ taskId, onClose, onUpdate, onDelete }) => {
    const [task, setTask] = useState<Task | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('None');

    useEffect(() => {
        if (!taskId) return;
        
        setLoading(true);
        setError(null);

        getTask(taskId)
            .then(data => {
                setTask(data);
                setTaskName(data.taskName);
                setDescription(data.description || '');
                setPriority(data.priority || 'None');
                setLoading(false);
            })
            .catch(err => {
                console.error("Erreur chargement tâche:", err);
                setError("Impossible de charger la tâche.");
                setLoading(false);
            });
    }, [taskId]);

    const handleSave = async () => {
        if (!task) return;
        try {
            const updated = await updateTask(task.id, {
                taskName,
                description,
                priority: priority as any
            });
            setTask(updated);
            onUpdate(updated);
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur update", error);
            setError("Erreur lors de la sauvegarde.");
        }
    };

    const handleDelete = async () => {
        if (!task || !confirm("Êtes-vous sûr de vouloir supprimer cette tâche ?")) return;
        try {
            await deleteTask(task.id);
            onDelete(task.id);
            onClose();
        } catch (error) {
            console.error("Erreur delete", error);
            setError("Erreur lors de la suppression.");
        }
    };

    const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    if (loading) {
        return (
            <div className="modal-overlay">
                <div className="modal-content" style={{ textAlign: 'center' }}>
                    <p>Chargement...</p>
                </div>
            </div>
        );
    }

    if (!task && !loading) {
        return null;
    }

    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-content">
                {error && <div style={{ color: 'red', marginBottom: '10px' }}>{error}</div>}

                {isEditing ? (
                    <div className="edit-mode">
                        <h2>Modifier la tâche</h2>
                        <label>Titre</label>
                        <input 
                            className="title-input"
                            type="text"
                            value={taskName} 
                            onChange={e => setTaskName(e.target.value)} 
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        />
                        
                        <label>Priorité</label>
                        <select 
                            value={priority} 
                            onChange={e => setPriority(e.target.value)}
                            style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
                        >
                            <option value="P0">Urgent (P0)</option>
                            <option value="P1">Important (P1)</option>
                            <option value="P2">Normal (P2)</option>
                            <option value="None">Aucune</option>
                        </select>

                        <label>Description</label>
                        <textarea 
                            value={description} 
                            onChange={e => setDescription(e.target.value)}
                            rows={5}
                            style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
                        />

                        <div className="modal-actions">
                            <button onClick={handleSave} style={{ backgroundColor: '#4CAF50', color: 'white' }}>Sauvegarder</button>
                            <button onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </div>
                ) : (
                    <div className="view-mode">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                            <h2 style={{ margin: 0 }}>{task?.taskName}</h2>
                            {task?.priority && task.priority !== 'None' && (
                                <span className={`priority-badge ${task.priority}`} style={{ padding: '4px 8px', borderRadius: '4px', background: '#eee' }}>
                                    {task.priority}
                                </span>
                            )}
                        </div>
                        
                        <div style={{ background: '#f9f9f9', padding: '10px', borderRadius: '4px', marginBottom: '20px', minHeight: '60px' }}>
                            <p style={{ whiteSpace: 'pre-wrap', margin: 0 }}>
                                {task?.description || <em style={{ color: '#888' }}>Aucune description...</em>}
                            </p>
                        </div>

                        <div className="modal-actions">
                            <button onClick={() => setIsEditing(true)}>Modifier</button>
                            <button 
                                onClick={handleDelete} 
                                style={{ backgroundColor: '#f44336', color: 'white', marginLeft: 'auto' }}
                            >
                                Supprimer
                            </button>
                            <button onClick={onClose}>Fermer</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskDetailModal;