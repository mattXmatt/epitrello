import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface Task {
    id: string;
    taskName: string;
    description: string;
    priority?: 'P0' | 'P1' | 'P2' | 'None';
    creatorName?: string;
    assignees?: { id: string; name: string }[];
    boardColumnId?: number;
    tags?: { id: string; name: string; color: string }[];
    dueDate?: string;
    comments?: any[];
}

interface TaskCardProps {
    task: Task;
    onClick?: () => void;
    isOverlay?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick, isOverlay }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: { type: 'Task', task: task },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.3 : 1,
        cursor: isOverlay ? 'grabbing' : 'grab',
        backgroundColor: 'white',
        padding: '12px',
        borderRadius: '8px',
        boxShadow: isOverlay ? '0 10px 20px rgba(0,0,0,0.2)' : '0 1px 2px rgba(9, 30, 66, 0.25)',
        border: '1px solid transparent',
        marginBottom: '8px',
        borderLeft: task.priority && task.priority !== 'None' ? `4px solid ${getPriorityColor(task.priority).text}` : '1px solid #ddd',
        position: 'relative' as const,
        touchAction: 'none' as const,
        height: 'auto',
    };

    function getPriorityColor(p?: string) {
        switch(p) {
            case 'P0': return { bg: '#ffebe6', text: '#bf2600' };
            case 'P1': return { bg: '#fffae6', text: '#ff991f' };
            case 'P2': return { bg: '#e3fcef', text: '#006644' };
            default: return { bg: 'transparent', text: 'transparent' };
        }
    }

    const priorityColors = getPriorityColor(task.priority);
    const isOverdue = task.dueDate && new Date(task.dueDate) < new Date();

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="task-card">
            
            {/* TAGS */}
            {task.tags && task.tags.length > 0 && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px'}}>
                    {task.tags.map(tag => (
                        <span key={tag.id} style={{ backgroundColor: tag.color, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>
                            {tag.name}
                        </span>
                    ))}
                </div>
            )}

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                <h3 style={{margin: 0, fontSize: '0.95rem', color: '#172b4d', wordWrap: 'break-word'}}>{task.taskName}</h3>
                {task.priority && task.priority !== 'None' && (
                    <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: priorityColors.bg, color: priorityColors.text }}>
                        {task.priority}
                    </span>
                )}
            </div>
            
            {task.description && (
                <p style={{fontSize: '0.85rem', color: '#5e6c84', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {task.description}
                </p>
            )}

            {/* DUE DATE BADGE */}
            {task.dueDate && (
                <div style={{marginTop: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: isOverdue ? '#bf2600' : '#5e6c84', backgroundColor: isOverdue ? '#ffebe6' : '#f4f5f7', padding: '4px 6px', borderRadius: '4px', display: 'inline-block'}}>
                    {new Date(task.dueDate).toLocaleDateString()}
                </div>
            )}
            
            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '24px'}}>
                {/* COMMENTS COUNT */}
                <div style={{fontSize: '0.8em', color: '#888', display: 'flex', gap: '8px'}}>
                    {task.comments && task.comments.length > 0 && (
                        <span> {task.comments.length}</span>
                    )}
                </div>

                {/* ASSIGNEES */}
                <div style={{display: 'flex'}}>
                    {(task.assignees || []).map((u, i) => (
                        <div key={i} title={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#0052cc', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0' }}>
                            {u.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TaskCard;