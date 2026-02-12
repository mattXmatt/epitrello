import React, { useState } from 'react';
import { Event } from './EventCard';

interface CreateEventFormProps {
    columnId: string;
    onAddEvent: (event: Omit<Event, 'id'>) => void;
    onClose: () => void;
}

const CreateEventForm: React.FC<CreateEventFormProps> = ({ columnId, onAddEvent, onClose }) => {
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [endingDate, setEndingDate] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAddEvent({ eventName, description, startingDate, endingDate });
    };

    return (
        <form onSubmit={handleSubmit}>
            <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                placeholder="Event Name"
                required
            />
            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
            />
            <input
                type="datetime-local"
                value={startingDate}
                onChange={(e) => setStartingDate(e.target.value)}
                required
            />
            <input
                type="datetime-local"
                value={endingDate}
                onChange={(e) => setEndingDate(e.target.value)}
                required
            />
            <div className="modal-actions">
                <button type="submit">Add Event</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateEventForm;
