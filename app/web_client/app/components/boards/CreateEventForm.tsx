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
    const [location, setLocation] = useState('');
    const [type, setType] = useState<'meeting' | 'event'>('meeting');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!eventName.trim() || !startingDate) return;

        const newEvent: Omit<Event, 'id'> = {
            eventName,
            description,
            startingDate: new Date(startingDate).toISOString(),
            location,
            type,
        };
        
        onAddEvent(newEvent);
    };

    return (
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginTop: '10px' }}>
            <div>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Event Title *</label>
                <input autoFocus placeholder="E.g. Daily Standup" value={eventName} onChange={e => setEventName(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} />
            </div>

            <div style={{ display: 'flex', gap: '15px' }}>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Start Date *</label>
                    <input type="datetime-local" value={startingDate} onChange={e => setStartingDate(e.target.value)} required style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} />
                </div>
                <div style={{ flex: 1 }}>
                    <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Type</label>
                    <select value={type} onChange={e => setType(e.target.value as any)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }}>
                        <option value="meeting">Meeting</option>
                        <option value="event">Event</option>
                    </select>
                </div>
            </div>

            <div>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Location / Link</label>
                <input placeholder="Zoom link or Room 3..." value={location} onChange={e => setLocation(e.target.value)} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} />
            </div>

            <div>
                <label style={{ fontSize: '0.85em', fontWeight: 'bold', color: '#5e6c84' }}>Description</label>
                <textarea placeholder="Agenda..." value={description} onChange={e => setDescription(e.target.value)} rows={3} style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #dfe1e6', marginTop: '5px' }} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={onClose} style={{ padding: '10px 15px', border: '1px solid #dfe1e6', background: 'white', borderRadius: '4px', cursor: 'pointer' }}>Cancel</button>
                <button type="submit" style={{ padding: '10px 15px', background: '#006644', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold' }}>Create Event</button>
            </div>
        </form>
    );
};

export default CreateEventForm;