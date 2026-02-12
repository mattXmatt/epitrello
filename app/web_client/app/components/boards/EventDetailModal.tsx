import React, { useState, useEffect } from 'react';
import { Event } from './EventCard';
import { getEvent, updateEvent, deleteEvent, getParticipants, updateEventPresence, assignUser, unassignUser } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface DetailedEvent extends Event {
    creatorName?: string;
    assignees: { id: string; name: string }[];
    presence: { userId: string; status: string; name: string }[];
}

interface EventDetailModalProps {
    eventId: string;
    boardId?: string;
    onClose: () => void;
    onUpdate: (updatedEvent: Event) => void;
    onDelete: (eventId: string) => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, boardId, onClose, onUpdate, onDelete }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState<DetailedEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [boardMembers, setBoardMembers] = useState<any[]>([]);

    const [eventName, setEventName] = useState('');
    const [description, setDescription] = useState('');
    const [startingDate, setStartingDate] = useState('');
    const [endingDate, setEndingDate] = useState('');
    const [type, setType] = useState('event');

    const formatDateForInput = (isoDate: string) => {
        if (!isoDate) return '';
        const d = new Date(isoDate);
        return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
    };

    useEffect(() => {
        if (!eventId) return;
        setLoading(true);
        Promise.all([
            getEvent(eventId),
            boardId ? getParticipants(boardId) : Promise.resolve([])
        ]).then(([evtData, members]) => {
            setEvent(evtData as DetailedEvent);
            setEventName(evtData.eventName);
            setDescription(evtData.description || '');
            setStartingDate(formatDateForInput(evtData.startingDate));
            setEndingDate(formatDateForInput(evtData.endingDate));
            setType(evtData.type || 'event');
            setBoardMembers(members);
            setLoading(false);
        }).catch(console.error);
    }, [eventId, boardId]);

    const handleSave = async () => {
        if (!event) return;
        const isoStart = new Date(startingDate).toISOString();
        const isoEnd = new Date(endingDate).toISOString();
        
        if (type === 'meeting' && (new Date(isoEnd).getTime() - new Date(isoStart).getTime()) / 3600000 > 5) {
            return alert("Meeting max 5h !");
        }

        try {
            const updated = await updateEvent(event.id, { 
                eventName, 
                description, 
                startingDate: isoStart, 
                endingDate: isoEnd, 
                type: type as any 
            });
            
            setEvent((prev: DetailedEvent | null) => prev ? ({ ...prev, ...updated }) : null);
            
            onUpdate(updated);
            setIsEditing(false);
        } catch (e) { console.error(e); }
    };

    const handleAssign = async (userId: string) => {
        if (!event || !userId) return;
        await assignUser(event.id, userId, 'event');
        
        const member = boardMembers.find(m => m.participantUserId == userId) 
                       || (user?.id == userId ? { name: user.username || user.email } : null);
        
        if (member && !event.assignees?.some(a => a.id == userId)) {
            setEvent((prev: DetailedEvent | null) => prev ? ({
                ...prev,
                assignees: [...(prev.assignees || []), { id: userId, name: member.name }]
            }) : null);
        }
    };

    const handleUnassign = async (userId: string) => {
        if (!event) return;
        await unassignUser(event.id, userId, 'event');
        setEvent((prev: DetailedEvent | null) => prev ? ({
            ...prev,
            assignees: prev.assignees.filter(a => a.id != userId)
        }) : null);
    };

    const handlePresenceChange = async (userId: string, status: string) => {
        if (!event) return;
        await updateEventPresence(event.id, userId, status);
        
        setEvent((prev: DetailedEvent | null) => {
            if (!prev) return null;
            const currentPresence = prev.presence || [];
            const existingIdx = currentPresence.findIndex(p => p.userId == userId);
            const newPresence = [...currentPresence];

            if (existingIdx >= 0) {
                newPresence[existingIdx] = { ...newPresence[existingIdx], status };
            } else {
                const memberName = boardMembers.find(m => m.participantUserId == userId)?.name 
                                 || (user?.id == userId ? (user.username || user.email) : 'User');
                newPresence.push({ userId, status, name: memberName });
            }
            return { ...prev, presence: newPresence };
        });
    };

    const handleDelete = async () => {
        if(confirm("Supprimer cet événement ?")) {
            await deleteEvent(eventId);
            onDelete(eventId);
            onClose();
        }
    };

    if (loading || !event) return <div className="modal-overlay"><div className="modal-content">Chargement...</div></div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <div className="edit-mode">
                        <h2>Modifier l'événement</h2>
                        <input value={eventName} onChange={e => setEventName(e.target.value)} className="title-input" />
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="event">Événement</option>
                            <option value="meeting">Meeting</option>
                        </select>
                        <div className="date-inputs">
                            <label>Début</label>
                            <input type="datetime-local" value={startingDate} onChange={e => setStartingDate(e.target.value)} />
                            <label>Fin</label>
                            <input type="datetime-local" value={endingDate} onChange={e => setEndingDate(e.target.value)} />
                        </div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} />
                        <div className="modal-actions">
                            <button onClick={handleSave} style={{background: '#4CAF50', color: 'white'}}>Sauvegarder</button>
                            <button onClick={() => setIsEditing(false)}>Annuler</button>
                        </div>
                    </div>
                ) : (
                    <div className="view-mode">
                        <div style={{display:'flex', justifyContent:'space-between', alignItems: 'center'}}>
                            <h2 style={{margin: 0}}>{event.eventName} <span className="badge">{event.type}</span></h2>
                        </div>
                        <div style={{fontSize: '0.85em', color: '#666', marginBottom: '15px'}}>Créé par: <strong>{event.creatorName}</strong></div>
                        
                        <div style={{marginBottom: '20px', padding: '12px', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #cce3ff'}}>
                            <strong style={{display: 'block', marginBottom: '8px'}}>Responsables :</strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px'}}>
                                {event.assignees?.map(a => (
                                    <span key={a.id} style={{background: '#0070f3', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85em'}}>
                                        {a.name}
                                        <span onClick={() => handleUnassign(a.id)} style={{marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold'}}>×</span>
                                    </span>
                                ))}
                                <div style={{display: 'flex', gap: '5px', width: '100%', marginTop: '10px'}}>
                                    <select 
                                        onChange={(e) => handleAssign(e.target.value)} 
                                        value=""
                                        style={{flex: 1, padding: '4px'}}
                                    >
                                        <option value="">+ Ajouter responsable</option>
                                        {boardMembers.map(m => (
                                            <option key={m.participantUserId} value={m.participantUserId}>{m.name}</option>
                                        ))}
                                    </select>
                                    {user && !event.assignees.some(a => a.id == user.id) && (
                                        <button onClick={() => handleAssign(user.id.toString())} style={{fontSize: '0.8em'}}>Moi</button>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="dates-display" style={{marginBottom: '15px', color: '#444'}}>
                            📅 {new Date(event.startingDate).toLocaleString()} — {new Date(event.endingDate).toLocaleString()}
                        </div>

                        {/* SECTION PRÉSENCE (Participants) */}
                        <div className="presence-section" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                            <h4 style={{margin: '0 0 10px 0'}}>Liste de présence ({event.presence?.length || 0})</h4>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px'}}>
                                {event.presence?.map(p => (
                                    <div key={p.userId} style={{background: '#fff', border:'1px solid #ddd', padding: '5px 12px', borderRadius: '6px', fontSize: '0.85em'}}>
                                        <strong>{p.name}</strong>: 
                                        <span style={{color: p.status === 'Présent' ? '#2e7d32' : '#ed6c02', marginLeft: '6px', fontWeight: 'bold'}}>{p.status}</span>
                                    </div>
                                ))}
                            </div>
                            {user && (
                                <button 
                                    onClick={() => handlePresenceChange(user.id.toString(), "Présent")} 
                                    style={{background: '#2e7d32', color: 'white', border: 'none', padding: '8px 15px', borderRadius: '4px', cursor: 'pointer'}}
                                >
                                    Je participe ✅
                                </button>
                            )}
                        </div>

                        <div style={{marginTop: '20px', whiteSpace: 'pre-wrap', color: '#555', fontStyle: event.description ? 'normal' : 'italic'}}>
                            {event.description || "Aucune description fournie."}
                        </div>
                        
                        <div className="modal-actions" style={{marginTop: '30px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                            <button onClick={() => setIsEditing(true)}>Modifier</button>
                            <button className="delete-btn" onClick={handleDelete} style={{background: '#d32f2f', color: 'white', marginLeft: 'auto'}}>Supprimer</button>
                            <button onClick={onClose}>Fermer</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailModal;