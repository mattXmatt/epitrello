import React from 'react';
import './task_card.css';

export interface Task {
    id: string;
    taskName: string;
    description: string;
    priority?: 'P0' | 'P1' | 'P2' | 'None';
    creatorName?: string;
    assignees?: { id: string; name: string }[];
}

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    return (
        <div 
            className="task-card" 
            onClick={onClick} 
            style={{
                cursor: 'pointer',
                border: '1px solid #080808',
                borderRadius: '8px',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: 'white',
                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                transition: 'border-color 0.2s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = '#0070f3'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = '#ddd'}
        >
            <div className="task-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{task.taskName}</h3>
                {task.priority && task.priority !== 'None' && (
                    <span className={`priority-badge ${task.priority}`}>
                        {task.priority}
                    </span>
                )}
            </div>
            
            {task.description && (
                <p style={{ fontSize: '0.9rem', color: '#555', margin: '0 0 10px 0' }}>
                    {task.description.length > 50 ? task.description.substring(0, 50) + '...' : task.description}
                </p>
            )}

            <div style={{ fontSize: '0.75rem', color: '#999', borderTop: '1px solid #f0f0f0', paddingTop: '8px', textAlign: 'right' }}>
                Créé par : <strong>{task.creatorName || 'Inconnu'}</strong>
            </div>
        </div>
    );
};

export default TaskCard;