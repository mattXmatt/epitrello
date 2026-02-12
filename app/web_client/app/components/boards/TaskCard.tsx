import React from 'react';
import './task_card.css';

export interface Task {
    id: string;
    taskName: string;
    description: string;
}

interface TaskCardProps {
    task: Task;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
    return (
        <div className="task-card">
            <h3>{task.taskName}</h3>
            <p>{task.description}</p>
        </div>
    );
};

export default TaskCard;
