import React, { useState, useEffect } from 'react';
import { Event } from './EventCard';
import { getEvent, updateEvent, deleteEvent } from '@/app/services/api';

interface EventDetailModalProps {
    eventId: string;
    onClose: () => void;
    onUpdate: (updatedEvent: Event) => void;
    onDelete: (eventId: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, onClose, onUpdate, onDelete }) => {
    const [event, setEvent] = useState<Event | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');

    // Form states
    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [endingDate, setEndingDate] = useState('');
    const [type, setType] = useState('event');

    // Helper pour formater la date pour l'input HTML (YYYY-MM-DDTHH:mm)
    const formatDateForInput = (isoDate: string) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    useEffect(() => {
        getEvent(eventId).then(data => {
            setEvent(data);
            setEventName(data.eventName);
            setDescription(data.description || '');
            setStartingDate(formatDateForInput(data.startingDate));
            setEndingDate(formatDateForInput(data.endingDate));
            setType(data.type || 'event');
            setLoading(false);
        }).catch(err => console.error(err));
    }, [eventId]);

    const handleSave = async () => {
        if (!event) return;
        setError('');

        // Conversion ISO pour le backend
        const isoStart = new Date(startingDate).toISOString();
        const isoEnd = new Date(endingDate).toISOString();

        // Validation durée meeting (Frontend check)
        if (type === 'meeting') {
            const durationHours = (new Date(isoEnd).getTime() - new Date(isoStart).getTime()) / (1000 * 60 * 60);
            if (durationHours > 5) {
                setError("Un meeting ne peut pas dépasser 5 heures !");
                return;
            }
        }

        try {
            const updated = await updateEvent(event.id, {
                eventName,
                description,
                startingDate: isoStart,
                endingDate: isoEnd,
                type: type as any
            });
            setEvent(updated);
            onUpdate(updated);
            setIsEditing(false);
        } catch (error) {
            console.error("Erreur update", error);
            setError("Erreur lors de la mise à jour");
        }
    };

    const handleDelete = async () => {
        if (!event || !confirm("Supprimer cet événement ?")) return;
        try {
            await deleteEvent(event.id);
            onDelete(event.id);
            onClose();
        } catch (error) {
            console.error("Erreur delete", error);
        }
    };

    if (loading) return <div className="modal-overlay"><div>Chargement...</div></div>;
    if (!event) return null;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <>
                        {error && <div style={{color: 'red', marginBottom: '10px'}}>{error}</div>}
                        <input className="title-input" value={eventName} onChange={e => setEventName(e.target.value)} />
                        
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="event">Événement</option>
                            <option value="meeting">Meeting</option>
                        </select>

                        <div className="date-inputs">
                            <input type="datetime-local" value={startingDate} onChange={e => setStartingDate(e.target.value)} />
                            <input type="datetime-local" value={endingDate} onChange={e => setEndingDate(e.target.value)} />
                        </div>

                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} />
                        
                        <div className="modal-actions">
                            <button onClick={handleSave}>Sauvegarder</button>
                            <button onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </>
                ) : (
                    <>
                        <h2>{event.eventName} <span className="badge">{event.type}</span></h2>
                        <div className="dates-display">
                            {new Date(event.startingDate).toLocaleString()} - {new Date(event.endingDate).toLocaleString()}
                        </div>
                        <p className="desc">{event.description || "Aucune description"}</p>
                        <div className="modal-actions">
                            <button onClick={() => setIsEditing(true)}>Modifier</button>
                            <button className="delete-btn" onClick={handleDelete}>Supprimer</button>
                            <button onClick={onClose}>Fermer</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default EventDetailModal;