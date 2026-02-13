import React, { useState, useEffect } from 'react';
import { Event } from './EventCard';
import { getEvent, updateEvent, deleteEvent, getParticipants, updateEventPresence, assignUser, unassignUser, getBoard } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';

interface DetailedEvent extends Event {
    creatorName?: string;
    assignees: { id: string; name: string }[];
    presence: { userId: string; status: string; name: string }[];
}

interface EventDetailModalProps {
    eventId: string;
    boardId?: string;
    columnId?: string;
    onClose: () => void;
    onUpdate: (updatedEvent: Event) => void;
    onDelete: (eventId: string) => void;
    onMove: () => void;
}

const EventDetailModal: React.FC<EventDetailModalProps> = ({ eventId, boardId, columnId, onClose, onUpdate, onDelete, onMove }) => {
    const { user } = useAuth();
    const [event, setEvent] = useState<DetailedEvent | null>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [boardMembers, setBoardMembers] = useState<any[]>([]);

    // Columns
    const [columns, setColumns] = useState<{id: string, columnName: string}[]>([]);
    const [selectedColumn, setSelectedColumn] = useState(columnId || '');

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
            boardId ? getParticipants(boardId) : Promise.resolve([]),
            boardId ? getBoard(boardId) : Promise.resolve(null)
        ]).then(([evtData, members, boardData]) => {
            const detailed = { 
                ...evtData, 
                assignees: (evtData as any).assignees || [],
                presence: (evtData as any).presence || []
            } as DetailedEvent;
            setEvent(detailed);
            setEventName(detailed.eventName);
            setDescription(detailed.description || '');
            setStartingDate(formatDateForInput(detailed.startingDate));
            setEndingDate(formatDateForInput(detailed.endingDate));
            setType(detailed.type || 'event');
            setBoardMembers(members);
            if(boardData) setColumns(boardData.columns);
            setLoading(false);
        }).catch(console.error);
    }, [eventId, boardId]);

    const handleSave = async () => {
        if (!event) return;
        const isoStart = new Date(startingDate).toISOString();
        const isoEnd = new Date(endingDate).toISOString();
        
        if (type === 'meeting' && (new Date(isoEnd).getTime() - new Date(isoStart).getTime()) / 3600000 > 5) return alert("Meeting cannot exceed 5 hours!");

        const updates: any = { 
            eventName, description, startingDate: isoStart, endingDate: isoEnd, type: type as any 
        };

        const columnChanged = selectedColumn && selectedColumn !== columnId;
        if (columnChanged) {
            updates.boardColumnId = parseInt(selectedColumn);
        }

        const updated = await updateEvent(event.id, updates);
        setEvent((prev: DetailedEvent | null) => prev ? ({ ...prev, ...updated }) : null);
        
        if (columnChanged) {
            onClose();
            onMove();
        } else {
            onUpdate(updated);
            setIsEditing(false);
        }
    };

    const handleAssign = async (userId: string) => {
        if (!event || !userId) return;
        await assignUser(event.id, userId, 'event');
        const member = boardMembers.find(m => m.participantUserId == userId) 
                       || (user?.id == userId ? { name: user.username || user.email } : null);
        
        const currentAssignees = event.assignees || [];
        if (member && !currentAssignees.some(a => a.id == userId)) {
            setEvent((prev: DetailedEvent | null) => prev ? ({
                ...prev,
                assignees: [...currentAssignees, { id: userId, name: member.name }]
            }) : null);
        }
    };

    const handleUnassign = async (userId: string) => {
        if (!event) return;
        await unassignUser(event.id, userId, 'event');
        setEvent((prev: DetailedEvent | null) => prev ? ({
            ...prev,
            assignees: (prev.assignees || []).filter(a => a.id != userId)
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
                const memberName = boardMembers.find(m => m.participantUserId == userId)?.name || user?.username || 'User';
                newPresence.push({ userId, status, name: memberName });
            }
            return { ...prev, presence: newPresence };
        });
    };

    const handleDelete = async () => {
        if(confirm("Delete this event?")) {
            await deleteEvent(eventId);
            onDelete(eventId);
            onClose();
        }
    };

    if (loading || !event) return <div className="modal-overlay"><div className="modal-content">Loading...</div></div>;

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
                {isEditing ? (
                    <div className="edit-mode">
                        <h2>Edit Event</h2>
                        <label style={{fontSize: '0.8em', fontWeight: 'bold'}}>Move to:</label>
                        <select 
                            value={selectedColumn} 
                            onChange={e => setSelectedColumn(e.target.value)}
                            style={{width: '100%', marginBottom: '15px', padding: '8px'}}
                        >
                            {columns.map(col => (
                                <option key={col.id} value={col.id}>{col.columnName}</option>
                            ))}
                        </select>

                        <input value={eventName} onChange={e => setEventName(e.target.value)} className="title-input" placeholder="Event Name" />
                        <select value={type} onChange={e => setType(e.target.value)}>
                            <option value="event">Event</option>
                            <option value="meeting">Meeting</option>
                        </select>
                        <div className="date-inputs">
                            <label>Start</label>
                            <input type="datetime-local" value={startingDate} onChange={e => setStartingDate(e.target.value)} />
                            <label>End</label>
                            <input type="datetime-local" value={endingDate} onChange={e => setEndingDate(e.target.value)} />
                        </div>
                        <textarea value={description} onChange={e => setDescription(e.target.value)} rows={5} placeholder="Description" />
                        <div className="modal-actions">
                            <button onClick={handleSave} style={{background: '#4CAF50', color: 'white'}}>Save</button>
                            <button onClick={() => setIsEditing(false)}>Cancel</button>
                        </div>
                    </div>
                ) : (
                    <div className="view-mode">
                        <h2>{event.eventName} <span className="badge">{event.type}</span></h2>
                        <div style={{fontSize: '0.85em', color: '#666', marginBottom: '15px'}}>Created by: <strong>{event.creatorName}</strong></div>
                        
                        {/* ASSIGNEES SECTION */}
                        <div style={{marginBottom: '20px', padding: '12px', background: '#f0f7ff', borderRadius: '8px', border: '1px solid #cce3ff'}}>
                            <strong>Assignees:</strong>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px'}}>
                                {(event.assignees || []).map(a => (
                                    <span key={a.id} style={{background: '#0070f3', color: 'white', padding: '4px 10px', borderRadius: '20px', fontSize: '0.85em'}}>
                                        {a.name}
                                        <span onClick={() => handleUnassign(a.id)} style={{marginLeft: '8px', cursor: 'pointer', fontWeight: 'bold'}}>×</span>
                                    </span>
                                ))}
                            </div>
                            <div style={{display: 'flex', gap: '5px', marginTop: '10px'}}>
                                <select onChange={(e) => handleAssign(e.target.value)} value="" style={{flex: 1}}>
                                    <option value="">+ Add assignee</option>
                                    {boardMembers.map(m => (
                                        <option key={m.participantUserId} value={m.participantUserId}>{m.name}</option>
                                    ))}
                                </select>
                                {user && !(event.assignees || []).some(a => a.id == user.id) && (
                                    <button onClick={() => handleAssign(user.id.toString())} style={{fontSize: '0.8em'}}>Me</button>
                                )}
                            </div>
                        </div>

                        <div className="dates-display">
                            📅 {new Date(event.startingDate).toLocaleString()} — {new Date(event.endingDate).toLocaleString()}
                        </div>

                        {/* ATTENDANCE SECTION */}
                        <div className="presence-section" style={{marginTop: '20px', borderTop: '1px solid #eee', paddingTop: '15px'}}>
                            <h4 style={{margin: '0 0 10px 0'}}>Attendance List ({(event.presence || []).length})</h4>
                            <div style={{display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px'}}>
                                {(event.presence || []).map(p => (
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
                                    I'm attending
                                </button>
                            )}
                        </div>

                        <p className="desc" style={{marginTop: '20px'}}>{event.description}</p>
                        
                        <div className="modal-actions">
                            <button onClick={() => setIsEditing(true)}>Edit / Move</button>
                            <button className="delete-btn" onClick={handleDelete} style={{background: '#d32f2f', color: 'white', marginLeft: 'auto'}}>Delete</button>
                            <button onClick={onClose}>Close</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default EventDetailModal;