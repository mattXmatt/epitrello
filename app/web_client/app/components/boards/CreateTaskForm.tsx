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
    const [priority, setPriority] = useState<'P0' | 'P1' | 'P2' | 'None'>('None');
    const [dueDate, setDueDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!taskName.trim()) return;

        const newTask: Omit<Task, 'id'> = {
            taskName,
            description,
            priority,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
        };
        
        onAddTask(newTask);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
            <div>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Task Title *</label>
                <input 
                    autoFocus 
                    placeholder="E.g. Fix the navigation bar..." 
                    value={taskName} 
                    onChange={e => setTaskName(e.target.value)} 
                    required 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} 
                />
            </div>

            <div>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Description</label>
                <textarea 
                    placeholder="Add details about this task..." 
                    value={description} 
                    onChange={e => setDescription(e.target.value)} 
                    rows={3} 
                    style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} 
                />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Priority</label>
                    <select 
                        value={priority} 
                        onChange={e => setPriority(e.target.value as any)} 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }}
                    >
                        <option value="None">None</option>
                        <option value="P0">P0 (Urgent)</option>
                        <option value="P1">P1 (High)</option>
                        <option value="P2">P2 (Normal)</option>
                    </select>
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Due Date</label>
                    <input 
                        type="date" 
                        value={dueDate} 
                        onChange={e => setDueDate(e.target.value)} 
                        style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} 
                    />
                </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 15px', border: '1px solid #dfe1e6', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 15px', background: '#0052cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Create Task</button>
            </div>
        </form>
    );
};

export default CreateTaskForm;