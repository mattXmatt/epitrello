import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export interface Event {
    id: string;
    eventName: string;
    description?: string;
    startingDate: string;
    endingDate?: string;
    type?: 'meeting' | 'event';
    location?: string;
    creatorName?: string;
    assignees?: { id: string; name: string }[];
    tags?: { id: string; name: string; color: string }[];
    comments?: any[];
    boardColumnId?: number;
}

interface EventCardProps {
    event: Event;
    onClick?: () => void;
    isOverlay?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick, isOverlay }) => {
    
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: event.id.toString(),
        data: { type: 'Event', event: event },
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
        borderLeft: '4px solid #006644', 
        marginBottom: '8px', 
        position: 'relative' as const,
        touchAction: 'none' as const,
    };

    return (
        <div ref={setNodeRef} style={style} {...attributes} {...listeners} onClick={onClick} className="task-card">
            {event.tags && event.tags.length > 0 && (
                <div style={{display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '6px'}}>
                    {event.tags.map(tag => (
                        <span key={tag.id} style={{ backgroundColor: tag.color, color: '#fff', fontSize: '10px', padding: '2px 6px', borderRadius: '4px', fontWeight: 'bold' }}>{tag.name}</span>
                    ))}
                </div>
            )}

            <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px'}}>
                <h3 style={{margin: 0, fontSize: '0.95rem', color: '#172b4d', wordWrap: 'break-word'}}> {event.eventName}</h3>
                <span style={{ fontSize: '0.65rem', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, textTransform: 'uppercase', backgroundColor: '#e3fcef', color: '#006644' }}>
                    {event.type}
                </span>
            </div>
            
            {event.description && (
                <p style={{fontSize: '0.85rem', color: '#5e6c84', margin: 0, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'}}>
                    {event.description}
                </p>
            )}

            {event.startingDate && (
                <div style={{marginTop: '8px', fontSize: '0.75rem', fontWeight: 'bold', color: '#5e6c84', backgroundColor: '#f4f5f7', padding: '4px 6px', borderRadius: '4px', display: 'inline-block'}}>
                    {new Date(event.startingDate).toLocaleString()}
                </div>
            )}
            
            <div style={{marginTop: '10px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', minHeight: '24px'}}>
                <div style={{fontSize: '0.8em', color: '#888', display: 'flex', gap: '8px'}}>
                    {event.comments && event.comments.length > 0 && <span> {event.comments.length}</span>}
                </div>

                <div style={{display: 'flex'}}>
                    {(event.assignees || []).map((u, i) => (
                        <div key={i} title={u.name} style={{ width: '24px', height: '24px', borderRadius: '50%', background: '#006644', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', border: '2px solid white', marginLeft: i > 0 ? '-8px' : '0' }}>
                            {u.name.charAt(0).toUpperCase()}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default EventCard;