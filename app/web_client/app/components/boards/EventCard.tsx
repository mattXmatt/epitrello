import React from 'react';
import './task_card.css'; // Using same styling as TaskCard for now

export interface Event {
    id: string;
    eventName: string;
    description: string;
    startingDate: string;
    endingDate: string;
}

const EventCard = ({ event }: { event: Event }) => {
    return (
        <div className="task-card">
            <div className="task-card-header">
                <h4>{event.eventName}</h4>
            </div>
            <div className="task-card-body">
                <p>{event.description}</p>
                <p>Starts: {new Date(event.startingDate).toLocaleString()}</p>
                <p>Ends: {new Date(event.endingDate).toLocaleString()}</p>
            </div>
        </div>
    );
};

export default EventCard;
