import React, { useState } from 'react';
import { Task } from './TaskCard';

interface CreateTaskFormProps {
    columnId: string;
    onAddTask: (task: Omit<Task, 'id'>) => void;
    onClose: () => void;
}

const CreateTaskForm: React.FC<CreateTaskFormProps> = ({ columnId, onAddTask, onClose }) => {
    const [taskName, setTaskName] = useState('');
    const [description, setDescription] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddTask({ taskName, description });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={taskName}
                onChange={(e) => setTaskName(e.target.value)}
                placeholder="Task Name"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Task Description"
            />
            <div className="modal-actions">
                <button type="submit">Add Task</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateTaskForm;
