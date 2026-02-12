import React from 'react';

export interface Task {
    id: string;
    taskName: string;
    description: string;
    priority?: 'P0' | 'P1' | 'P2' | 'None';
}

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
    return (
        <div className="task-card" onClick={onClick} style={{cursor: 'pointer'}}>
            <div className="task-header">
                <h3>{task.taskName}</h3>
                {task.priority && task.priority !== 'None' && (
                    <span className={`priority-badge ${task.priority}`}>
                        {task.priority}
                    </span>
                )}
            </div>
            {task.description && <p>{task.description.substring(0, 50)}...</p>}
        </div>
    );
};

export default TaskCard;