import React from 'react';

export interface Event {
    id: string;
    eventName: string;
    description: string;
    startingDate: string;
    endingDate: string;
    type: 'meeting' | 'event';
    creatorName?: string;
    assignees?: { id: string; name: string }[];
}

interface EventCardProps {
    event: Event;
    onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    const borderColor = event.type === 'meeting' ? '#9C27B0' : '#2196F3';

    return (
        <div 
            className={`event-card ${event.type}`} 
            onClick={onClick} 
            style={{
                cursor: 'pointer',
                borderLeft: `4px solid ${borderColor}`,
                borderTop: '1px solid #eee',
                borderRight: '1px solid #eee',
                borderBottom: '1px solid #eee',
                borderRadius: '4px',
                padding: '12px',
                marginBottom: '10px',
                backgroundColor: '#fff'
            }}
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h3 style={{ margin: 0, fontSize: '1rem' }}>{event.eventName}</h3>
                <span style={{ 
                    fontSize: '0.7em', 
                    padding: '2px 6px', 
                    borderRadius: '4px', 
                    backgroundColor: borderColor + '20',
                    color: borderColor,
                    textTransform: 'uppercase',
                    fontWeight: 'bold'
                }}>
                    {event.type}
                </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 8px 0' }}>
                {event.description}
            </p>
            
            <div className="event-dates" style={{ fontSize: '0.8rem', color: '#888' }}>
                {new Date(event.startingDate).toLocaleDateString()}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#aaa', marginTop: '8px', textAlign: 'right' }}>
                Par : {event.creatorName || 'Inconnu'}
            </div>
        </div>
    );
};

export default EventCard;