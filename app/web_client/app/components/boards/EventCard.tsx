import React from 'react';

export interface Event {
    id: string;
    eventName: string;
    description: string;
    startingDate: string;
    endingDate: string;
    type: 'meeting' | 'event';
}

interface EventCardProps {
    event: Event;
    onClick?: () => void;
}

const EventCard: React.FC<EventCardProps> = ({ event, onClick }) => {
    return (
        <div className={`event-card ${event.type}`} onClick={onClick} style={{cursor: 'pointer'}}>
            <h3>{event.eventName}</h3>
            <span className="event-type-badge" style={{ fontSize: '0.8em', color: '#666', textTransform: 'uppercase' }}>
                {event.type}
            </span>
            <p>{event.description}</p>
            <div className="event-dates">
                <span>{new Date(event.startingDate).toLocaleDateString()}</span>
            </div>
        </div>
    );
};

export default EventCard;