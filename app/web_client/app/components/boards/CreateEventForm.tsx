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
    const [type, setType] = useState<'meeting' | 'event'>('event');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        
        // CORRECTION ICI : Conversion en format ISO complet pour le backend
        const isoStartingDate = new Date(startingDate).toISOString();
        const isoEndingDate = new Date(endingDate).toISOString();

        onAddEvent({ 
            eventName, 
            description, 
            startingDate: isoStartingDate, 
            endingDate: isoEndingDate, 
            type 
        });
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
            
            <select 
                value={type} 
                onChange={(e) => setType(e.target.value as 'meeting' | 'event')}
                style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
            >
                <option value="event">Event</option>
                <option value="meeting">Meeting</option>
            </select>

            <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Event Description"
            />
            <div style={{display: 'flex', gap: '10px'}}>
                <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8em'}}>Début</label>
                    <input
                        type="datetime-local"
                        value={startingDate}
                        onChange={(e) => setStartingDate(e.target.value)}
                        required
                    />
                </div>
                <div style={{flex: 1}}>
                    <label style={{fontSize: '0.8em'}}>Fin</label>
                    <input
                        type="datetime-local"
                        value={endingDate}
                        onChange={(e) => setEndingDate(e.target.value)}
                        required
                    />
                </div>
            </div>

            <div className="modal-actions">
                <button type="submit">Add {type === 'meeting' ? 'Meeting' : 'Event'}</button>
                <button type="button" onClick={onClose}>
                    Cancel
                </button>
            </div>
        </form>
    );
};

export default CreateEventForm;