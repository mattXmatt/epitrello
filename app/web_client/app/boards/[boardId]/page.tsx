"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { HexColorPicker } from 'react-colorful';
import BoardColumn from '@/app/components/boards/BoardColumn';
import TaskCard, { Task } from '@/app/components/boards/TaskCard';
import {
    getBoard, createColumn, updateBoardSettings, updateEvent,
    inviteUser, getParticipants, getNotifications,
    markNotificationAsRead, Board, updateTask,
    removeParticipant, updateParticipantRole
} from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import EventCard, { Event } from '@/app/components/boards/EventCard';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { updateColumn } from '@/app/services/api';
import '../../styles/BoardPage.css';
import {
    DndContext, DragOverlay, closestCorners,
    KeyboardSensor, PointerSensor, useSensor, useSensors,
    DragStartEvent, DragOverEvent, DragEndEvent
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const IconBell = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
    </svg>
);
const IconSettings = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="3"/>
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
    </svg>
);
const IconClose = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IconPlus = () => (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
);
const IconDoc = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
    </svg>
);

const BoardPage = () => {
    const params = useParams();
    const boardId = params?.boardId as string;
    const { user } = useAuth();

    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);
    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [activeColumn, setActiveColumn] = useState<any | null>(null);

    const [showAddColumn, setShowAddColumn] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    const [newColumnName, setNewColumnName] = useState('');
    const [bgColor, setBgColor] = useState('#f4f5f7');
    const [colorSaved, setColorSaved] = useState(false);

    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');
    const [inviteStatus, setInviteStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
    const [inviteLoading, setInviteLoading] = useState(false);

    const [userRole, setUserRole] = useState<string>('member');
    const [participants, setParticipants] = useState<any[]>([]);
    const [notifications, setNotifications] = useState<any[]>([]);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node))
                setShowColorPicker(false);
        };
        if (showColorPicker) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showColorPicker]);

    const fetchNotifs = async () => {
        try { const data = await getNotifications(); setNotifications(data || []); } catch {}
    };

    useEffect(() => {
        if (!boardId || boardId === 'undefined') return;
        setLoading(true);
        Promise.all([getBoard(boardId), getParticipants(boardId)])
            .then(([boardData, participantsData]) => {
                setBoard(boardData);
                setBgColor(boardData.backgroundColor || '#f4f5f7');
                setParticipants(participantsData || []);
                if (user) {
                    if (String(boardData.createdBy) === String(user.id)) {
                        setUserRole('admin');
                    } else {
                        const me = (participantsData || []).find((p: any) => String(p.participantUserId) === String(user.id));
                        if (me) setUserRole(me.role);
                    }
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
        fetchNotifs();
        const interval = setInterval(fetchNotifs, 10000);
        return () => clearInterval(interval);
    }, [boardId, user]);

    const refreshBoard = async () => {
    if (!boardId || boardId === 'undefined') return;
    const [boardData, participantsData] = await Promise.all([
        getBoard(boardId),
        getParticipants(boardId)
    ]);
    setBoard(boardData);
    setParticipants(participantsData || []);
    if (user) {
        if (String(boardData.createdBy) === String(user.id)) {
            setUserRole('admin');
        } else {
            const me = (participantsData || []).find((p: any) => String(p.participantUserId) === String(user.id));
            setUserRole(me?.role || 'member');
        }
    }
};

    const handleReadNotification = async (notifId: string) => {
        await markNotificationAsRead(notifId);
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    };

    const handleMarkAllRead = async () => {
        await Promise.all(notifications.filter(n => !n.isRead).map(n => markNotificationAsRead(n.id)));
        setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
    };

    /* ─── Drag & Drop ─── */
    const handleDragStart = (event: DragStartEvent) => {
        const { active } = event;
        const type = active.data.current?.type;
        if (type === 'Task') setActiveTask(findTask(active.id as string));
        if (type === 'Event') setActiveEvent(findEvent(active.id as string));
        if (type === 'Column') setActiveColumn(findColumnById(active.id as string));
    };

    const handleDragOver = (event: DragOverEvent) => {
        const { active, over } = event;
        if (!over) return;

        const activeType = active.data.current?.type;
        const overType = over.data.current?.type;

        if (activeType === "Column") return;

        if (activeType === "Task" || activeType === "Event") {
            const activeCol = findColumnByCardId(active.id as string, activeType);
            const overCol =
            findColumnByCardId(over.id as string, overType) ||
            findColumnById(over.id as string);

            if (!activeCol || !overCol || activeCol.id === overCol.id) return;

            setBoard((prev) => {
                if (!prev) return prev;

                const cols = [...prev.columns];
                const ai = cols.findIndex((c) => c.id === activeCol.id);
                const oi = cols.findIndex((c) => c.id === overCol.id);
                if (ai === -1 || oi === -1) return prev;

                if (activeType === "Task") {
                    const ti = cols[ai].tasks.findIndex((t) => t.id === active.id);
                    if (ti === -1) return prev;
                    const [moved] = cols[ai].tasks.splice(ti, 1);
                    cols[oi].tasks.push(moved);
                } else {
                    const ei = cols[ai].events.findIndex((e) => e.id === active.id);
                    if (ei === -1) return prev;
                    const [moved] = cols[ai].events.splice(ei, 1);
                    cols[oi].events.push(moved);
                }

                return { ...prev, columns: cols };
            });
        }
    };


    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeType = active.data.current?.type;
        setActiveTask(null); setActiveEvent(null); setActiveColumn(null);
        if (!over) return;
        if (activeType === 'Column' && active.id !== over.id && board) {
            const oi = board.columns.findIndex(c => c.id.toString() === active.id.toString());
            const ni = board.columns.findIndex(c => c.id.toString() === over.id.toString());
            const newCols = arrayMove(board.columns, oi, ni);
            setBoard({ ...board, columns: newCols });
            newCols.forEach((col, idx) => updateColumn(col.id, { columnIndex: idx }));
        }
        if (activeType === "Task" || activeType === "Event") {
            const srcCol = findColumnByCardId(active.id as string, activeType);
            const destCol =
            findColumnByCardId(over.id as string, activeType) ||
            findColumnById(over.id as string);

            if (!destCol || !srcCol) {
                await refreshBoard();
                return;
            }

            if (srcCol.id.toString() === destCol.id.toString()) {
                return;
            }

            try {
            if (activeType === "Task") {
                await updateTask(active.id as string, {
                boardColumnId: Number(destCol.id),
                });
            } else if (activeType === "Event") {
                await updateEvent(active.id as string, {
                boardColumnId: Number(destCol.id),
                });
            }
            } catch (err) {
                console.error("Erreur update task/event:", err);
            } finally {
            await refreshBoard();
                }
        }
    };

    const findColumnByCardId = (id: string, type: string) => {
        if (type === 'Task') return board?.columns.find(c => c.tasks?.some(t => t.id === id));
        if (type === 'Event') return board?.columns.find(c => c.events?.some(e => e.id === id));
        return null;
    };
    const findColumnById = (id: string) => board?.columns.find(c => c.id.toString() === id.toString());
    const findTask = (id: string) => { for (const c of board?.columns || []) { const t = c.tasks?.find(t => t.id === id); if (t) return t; } return null; };
    const findEvent = (id: string) => { for (const c of board?.columns || []) { const e = c.events?.find(e => e.id === id); if (e) return e; } return null; };

    const handleAddColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnName.trim() || !board)
            return;

        const nextIndex = board.columns.length;
        const newCol = await createColumn(board.id, newColumnName, nextIndex);
        setBoard(prev =>
            prev ? { ...prev, columns: [...prev.columns, newCol] } : null
        );

        setNewColumnName("");
        setShowAddColumn(false);
    };

    const handleSaveColor = async () => {
        await updateBoardSettings(boardId, bgColor);
        setColorSaved(true);
        setShowColorPicker(false);
        setTimeout(() => setColorSaved(false), 2500);
    };

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inviteEmail.trim()) return;
        setInviteLoading(true);
        setInviteStatus(null);
        try {
            const res = await inviteUser(boardId, inviteEmail, inviteRole);
            const ok = res && !res.error && res.status !== 'error';
            if (ok) {
                setInviteStatus({ type: 'success', message: `Invitation envoyée à ${inviteEmail}` });
                setInviteEmail('');
                setInviteRole('member');
                refreshBoard();
            } else {
                setInviteStatus({ type: 'error', message: res?.message || "Erreur lors de l'invitation." });
            }
        } catch (err: any) {
            setInviteStatus({ type: 'error', message: err?.message || "Erreur lors de l'invitation." });
        } finally {
            setInviteLoading(false);
        }
    };

    const handleRemoveParticipant = async (participantId: string) => {
        if (!confirm('Retirer ce membre du board ?')) return;
        await removeParticipant(participantId);
        refreshBoard();
    };

    const handleToggleRole = async (participantId: string, currentRole: string) => {
        const newRole = currentRole === 'admin' ? 'member' : 'admin';
        await updateParticipantRole(participantId, newRole);
        refreshBoard();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;
    const isAdmin = userRole === 'admin';

    if (loading) return <div className="board-loading"><div className="board-spinner" /></div>;
    if (!board) return <div className="board-error">Board introuvable.</div>;

    return (
        <div className="board-page" style={{ backgroundColor: bgColor }}>

            <header className="board-header">
                <div className="board-header-left">
                    <h1 className="board-title">{board.boardName}</h1>
                    <span className={`role-badge role-${userRole}`}>{userRole}</span>
                </div>
                <div className="board-header-right">
                    <Link href={`/boards/${boardId}/documentation`} className="hdr-btn" title="Documentation">
                        <IconDoc /><span>Docs</span>
                    </Link>
                    <button className={`hdr-btn${showNotifications ? ' active' : ''}`} onClick={() => { setShowNotifications(v => !v); setShowSettings(false); }} title="Notifications">
                        <IconBell />
                        {unreadCount > 0 && <span className="notif-badge">{unreadCount}</span>}
                    </button>
                    {isAdmin && (
                        <button className={`hdr-btn${showSettings ? ' active' : ''}`} onClick={() => { setShowSettings(v => !v); setShowNotifications(false); }} title="Paramètres">
                            <IconSettings />
                        </button>
                    )}
                    {isAdmin && (
                        <button className="hdr-btn hdr-btn-primary" onClick={() => setShowAddColumn(true)}>
                            <IconPlus /><span>Colonne</span>
                        </button>
                    )}
                </div>
            </header>

            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                <SortableContext items={board.columns.map(c => c.id.toString())} strategy={horizontalListSortingStrategy}>
                    <div className="board-columns">
                        {board.columns.map(column => (
                            <BoardColumn key={column.id} column={column} onRefreshBoard={refreshBoard} isAdmin={isAdmin} />
                        ))}
                    </div>
                </SortableContext>
                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                    {activeEvent ? <EventCard event={activeEvent} isOverlay /> : null}
                    {activeColumn ? <div className="col-drag-ghost">{activeColumn.columnName}</div> : null}
                </DragOverlay>
            </DndContext>

            {(showNotifications || showSettings) && (
                <div className="panel-overlay" onClick={() => { setShowNotifications(false); setShowSettings(false); }} />
            )}

            {/* Notifications */}
            <aside className={`side-panel${showNotifications ? ' open' : ''}`}>
                <div className="side-panel-header">
                    <h2>Notifications</h2>
                    <div className="side-panel-actions">
                        {unreadCount > 0 && <button className="panel-text-btn" onClick={handleMarkAllRead}>Tout lire</button>}
                        <button className="panel-close-btn" onClick={() => setShowNotifications(false)}><IconClose /></button>
                    </div>
                </div>
                <div className="side-panel-body">
                    {notifications.length === 0 ? (
                        <div className="panel-empty"><IconBell /><p>Aucune notification</p></div>
                    ) : notifications.map(n => (
                        <div key={n.id} className={`notif-item${n.isRead ? '' : ' unread'}`}>
                            <div className="notif-dot" />
                            <div className="notif-body">
                                <p className="notif-message">{n.message}</p>
                                <span className="notif-date">{new Date(n.createdAt).toLocaleString('fr-FR')}</span>
                            </div>
                            {!n.isRead && <button className="notif-read-btn" onClick={() => handleReadNotification(n.id)} title="Marquer lu" />}
                        </div>
                    ))}
                </div>
            </aside>

            {/* Settings */}
            {isAdmin && (
                <aside className={`side-panel${showSettings ? ' open' : ''}`}>
                    <div className="side-panel-header">
                        <h2>Paramètres</h2>
                        <button className="panel-close-btn" onClick={() => setShowSettings(false)}><IconClose /></button>
                    </div>
                    <div className="side-panel-body">

                        <section className="settings-section">
                            <h3 className="settings-label">Fond du board</h3>
                            <div className="color-picker-wrap" ref={colorPickerRef}>
                                <div className="color-trigger" onClick={() => setShowColorPicker(v => !v)}>
                                    <div className="color-swatch" style={{ backgroundColor: bgColor }} />
                                    <code className="color-code">{bgColor}</code>
                                    <span className="color-trigger-chevron">{showColorPicker ? '▲' : '▼'}</span>
                                </div>
                                {showColorPicker && (
                                    <div className="color-popover">
                                        <HexColorPicker color={bgColor} onChange={setBgColor} />
                                        <div className="color-popover-footer">
                                            <input className="color-hex-input" value={bgColor} onChange={e => { const v = e.target.value; if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBgColor(v); }} maxLength={7} />
                                            <button className={`color-apply-btn${colorSaved ? ' saved' : ''}`} onClick={handleSaveColor}>
                                                {colorSaved ? 'Sauvegardé !' : 'Appliquer'}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </section>

                        <section className="settings-section">
                            <h3 className="settings-label">Inviter un membre</h3>
                            <form onSubmit={handleInvite} className="invite-form">
                                <input type="email" value={inviteEmail} onChange={e => { setInviteEmail(e.target.value); setInviteStatus(null); }} placeholder="email@exemple.com" required className="invite-input" />
                                <div className="invite-row">
                                    <select value={inviteRole} onChange={e => setInviteRole(e.target.value)} className="invite-select">
                                        <option value="member">Membre</option>
                                        <option value="admin">Admin</option>
                                    </select>
                                    <button type="submit" className="invite-btn" disabled={inviteLoading}>
                                        {inviteLoading ? '...' : 'Inviter'}
                                    </button>
                                </div>
                            </form>
                            {inviteStatus && <div className={`invite-status ${inviteStatus.type}`}>{inviteStatus.message}</div>}
                        </section>

                        <section className="settings-section">
                            <h3 className="settings-label">Membres ({participants.length})</h3>
                            {participants.length === 0 ? (
                                <p className="panel-empty-text">Aucun membre invité.</p>
                            ) : (
                                <div className="members-list">
                                    {participants.map((p: any) => (
                                        <div key={p.id ?? p.participantUserId} className="member-item">
                                            <div className="member-avatar">
                                                {(p.username || p.name || p.email || '?')[0].toUpperCase()}
                                            </div>
                                            <div className="member-info">
                                                <span className="member-name">{p.username || p.name || p.email}</span>
                                                <span className="member-role">{p.role}</span>
                                            </div>
                                            <div className="member-actions">
                                                <button
                                                    className="member-role-btn"
                                                    onClick={() => handleToggleRole(p.id, p.role)}
                                                    title={p.role === 'admin' ? 'Rétrograder membre' : 'Promouvoir admin'}
                                                >
                                                    {p.role === 'admin' ? '⬇' : '⬆'}
                                                </button>
                                                <button
                                                    className="member-remove-btn"
                                                    onClick={() => handleRemoveParticipant(p.id)}
                                                    title="Retirer du board"
                                                >
                                                    ✕
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </section>

                    </div>
                </aside>
            )}

            {showAddColumn && (
                <div className="modal-overlay" onClick={() => setShowAddColumn(false)}>
                    <div className="brd-modal" onClick={e => e.stopPropagation()}>
                        <div className="brd-modal-header">
                            <h2>Nouvelle colonne</h2>
                            <button className="panel-close-btn" onClick={() => setShowAddColumn(false)}><IconClose /></button>
                        </div>
                        <form onSubmit={handleAddColumn}>
                            <input type="text" value={newColumnName} onChange={e => setNewColumnName(e.target.value)} placeholder="Ex: À faire, En cours..." required autoFocus className="brd-modal-input" />
                            <div className="brd-modal-actions">
                                <button type="button" className="brd-btn-sec" onClick={() => setShowAddColumn(false)}>Annuler</button>
                                <button type="submit" className="brd-btn-pri">Ajouter</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPage;
