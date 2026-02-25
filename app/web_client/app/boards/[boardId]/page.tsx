"use client";
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import BoardColumn from '@/app/components/boards/BoardColumn';
import TaskCard, { Task } from '@/app/components/boards/TaskCard';
import { getBoard, createColumn, updateBoardSettings, updateEvent, inviteUser, getParticipants, getNotifications, markNotificationAsRead, Board, updateTask } from '@/app/services/api';
import { useAuth } from '@/app/contexts/AuthContext';
import EventCard, { Event } from '@/app/components/boards/EventCard';
import { SortableContext, horizontalListSortingStrategy, arrayMove } from '@dnd-kit/sortable';
import { updateColumn } from '@/app/services/api';
import '../../styles/BoardPage.css';

import { DndContext, DragOverlay, closestCorners, KeyboardSensor, PointerSensor, useSensor, useSensors, DragStartEvent, DragOverEvent, DragEndEvent } from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';

const BoardPage = () => {
    const params = useParams();
    const boardId = params?.boardId as string;
    const { user } = useAuth();

    const [board, setBoard] = useState<Board | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTask, setActiveTask] = useState<Task | null>(null);

    const [showModal, setShowModal] = useState(false);
    const [showSettings, setShowSettings] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);

    const [newColumnName, setNewColumnName] = useState('');
    const [bgColor, setBgColor] = useState('#ffffff');
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviteRole, setInviteRole] = useState('member');

    const [userRole, setUserRole] = useState<string>('member');
    const [notifications, setNotifications] = useState<any[]>([]);

    const [activeEvent, setActiveEvent] = useState<Event | null>(null);
    const [activeColumn, setActiveColumn] = useState<any | null>(null);

    const sensors = useSensors(
        useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
        useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
    );

    useEffect(() => {
        if (boardId && boardId !== 'undefined') {
            setLoading(true);
            
            const fetchNotifs = async () => {
                const notifsData = await getNotifications();
                setNotifications(notifsData || []);
            };

            Promise.all([
                getBoard(boardId),
                getParticipants(boardId)
            ]).then(([boardData, participantsData]) => {
                setBoard(boardData);
                setBgColor(boardData.backgroundColor || '#ffffff');
                
                if (user) {
                    if (boardData.createdBy === user.id) {
                        setUserRole('admin');
                    } else {
                        const me = participantsData.find((p: any) => p.participantUserId === user.id);
                        if (me) setUserRole(me.role);
                    }
                }
                setLoading(false);
            }).catch(() => setLoading(false));

            fetchNotifs();
            
            const interval = setInterval(fetchNotifs, 10000);
            return () => clearInterval(interval);
        }
    }, [boardId, user]);

    const refreshBoard = async () => {
        if (boardId && boardId !== 'undefined') {
            const data = await getBoard(boardId);
            setBoard(data);
        }
    };

    const handleReadNotification = async (notifId: string) => {
        await markNotificationAsRead(notifId);
        setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, isRead: true } : n));
    };

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

        if (activeType === 'Column') return; 

        if (activeType === 'Task' || activeType === 'Event') {
            const activeColumn = findColumnByCardId(active.id as string, activeType);
            const overColumn = findColumnByCardId(over.id as string, overType) || findColumnById(over.id as string);

            if (!activeColumn || !overColumn || activeColumn.id === overColumn.id) return;

            setBoard((prev) => {
                if (!prev) return null;
                const newColumns = [...prev.columns];
                const actColIdx = newColumns.findIndex(c => c.id === activeColumn.id);
                const ovColIdx = newColumns.findIndex(c => c.id === overColumn.id);

                if (activeType === 'Task') {
                    const tIndex = newColumns[actColIdx].tasks.findIndex(t => t.id === active.id);
                    const [moved] = newColumns[actColIdx].tasks.splice(tIndex, 1);
                    newColumns[ovColIdx].tasks.push(moved);
                } else if (activeType === 'Event') {
                    const eIndex = newColumns[actColIdx].events.findIndex(e => e.id === active.id);
                    const [moved] = newColumns[actColIdx].events.splice(eIndex, 1);
                    newColumns[ovColIdx].events.push(moved);
                }
                return { ...prev, columns: newColumns };
            });
        }
    };

    const handleDragEnd = async (event: DragEndEvent) => {
        const { active, over } = event;
        const activeType = active.data.current?.type;

        setActiveTask(null);
        setActiveEvent(null);
        setActiveColumn(null);

        if (!over) return;

        if (activeType === 'Column') {
            if (active.id !== over.id && board) {
                const oldIndex = board.columns.findIndex(c => c.id.toString() === active.id.toString());
                const newIndex = board.columns.findIndex(c => c.id.toString() === over.id.toString());
                
                const newColumns = arrayMove(board.columns, oldIndex, newIndex);
                setBoard({ ...board, columns: newColumns });
                
                newColumns.forEach((col, index) => {
                    updateColumn(col.id, { columnIndex: index });
                });
            }
        } else if (activeType === 'Task' || activeType === 'Event') {
            const destColumn = findColumnByCardId(active.id as string, activeType) || findColumnById(over.id as string);
            if (destColumn) {
                try {
                    if (activeType === 'Task') await updateTask(active.id as string, { boardColumnId: parseInt(destColumn.id) });
                    if (activeType === 'Event') await updateEvent(active.id as string, { boardColumnId: parseInt(destColumn.id) });
                } catch (error) {
                    console.error("Failed to move card", error);
                    refreshBoard();
                }
            }
        }
    };

    const findColumnByCardId = (cardId: string, type: string) => {
        if (type === 'Task') return board?.columns.find((col) => col.tasks?.some((t) => t.id === cardId));
        if (type === 'Event') return board?.columns.find((col) => col.events?.some((e) => e.id === cardId));
        return null;
    };
    const findEvent = (eventId: string) => {
        for (const col of board?.columns || []) {
            const ev = col.events?.find(e => e.id === eventId);
            if (ev) return ev;
        }
        return null;
    };

    const findColumnByTaskId = (taskId: string) => board?.columns.find((col) => col.tasks?.some((t) => t.id === taskId));
    const findColumnById = (colId: string) => board?.columns.find((col) => col.id.toString() === colId.toString());
    const findTask = (taskId: string) => {
        for (const col of board?.columns || []) {
            const task = col.tasks?.find(t => t.id === taskId);
            if (task) return task;
        }
        return null;
    };

    const handleAddColumn = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newColumnName.trim() || !board) return;
        const newColumn = await createColumn(board.id, newColumnName);
        setBoard(prev => prev ? { ...prev, columns: [...prev.columns, newColumn] } : null);
        setNewColumnName('');
        setShowModal(false);
    };

    const handleSaveSettings = async () => {
        await updateBoardSettings(boardId, bgColor);
        if(inviteEmail) {
            await inviteUser(boardId, inviteEmail /*, inviteRole */); 
            alert(`User ${inviteEmail} invited as ${inviteRole}!`);
            setInviteEmail('');
        }
        setShowSettings(false);
        refreshBoard();
    };

    const unreadCount = notifications.filter(n => !n.isRead).length;

    if (loading) return <div style={{display:'flex', justifyContent:'center', marginTop:'50px'}}>Loading...</div>;
    if (!board) return <div>Board not found</div>;

    const isAdmin = userRole === 'admin';

    return (
        <div className="board-page-container" style={{ backgroundColor: bgColor, minHeight: '100vh' }}>
            <div className="board-header">
                <div style={{display: 'flex', alignItems: 'center', gap: '15px'}}>
                    <h1>{board.boardName}</h1>
                    <span style={{fontSize: '0.8em', backgroundColor: 'rgba(0,0,0,0.1)', padding: '4px 8px', borderRadius: '4px'}}>
                        Role: {userRole}
                    </span>
                </div>
                
                <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <button onClick={() => setShowNotifications(true)} style={{position: 'relative'}}>
                        Notifications 
                        {unreadCount > 0 && (
                            <span style={{position: 'absolute', top: '-5px', right: '-5px', background: 'red', color: 'white', borderRadius: '50%', padding: '2px 6px', fontSize: '10px'}}>{unreadCount}</span>
                        )}
                    </button>

                    {isAdmin && (
                        <button onClick={() => setShowSettings(true)}>⚙️ Settings</button>
                    )}
                    
                    {isAdmin && (
                        <button onClick={() => setShowModal(true)} className="add-column-btn">+ Column</button>
                    )}
                </div>
            </div>
            
            <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
                
                <SortableContext items={board.columns.map(c => c.id.toString())} strategy={horizontalListSortingStrategy}>
                    <div className="board-columns-container">
                        {board.columns.map(column => (
                            <BoardColumn key={column.id} column={column} onRefreshBoard={refreshBoard} />
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeTask ? <TaskCard task={activeTask} isOverlay /> : null}
                    {activeEvent ? <EventCard event={activeEvent} isOverlay /> : null}
                    {activeColumn ? (
                        <div style={{ backgroundColor: activeColumn.color || '#f4f5f7', width: '300px', height: '100px', borderRadius: '8px', padding: '10px', opacity: 0.8, boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                            <h3>{activeColumn.columnName}</h3>
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>

            {showNotifications && (
                <div className="modal-overlay" onClick={() => setShowNotifications(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Your Notifications</h2>
                        <div style={{maxHeight: '300px', overflowY: 'auto'}}>
                            {notifications.length === 0 ? <p>No notifications.</p> : notifications.map(n => (
                                <div key={n.id} style={{padding: '10px', borderBottom: '1px solid #eee', backgroundColor: n.isRead ? 'transparent' : '#f0f8ff'}}>
                                    <p style={{margin: '0 0 5px 0'}}>{n.message}</p>
                                    <div style={{display: 'flex', justifyContent: 'space-between', fontSize: '0.8em', color: '#888'}}>
                                        <span>{new Date(n.createdAt).toLocaleString()}</span>
                                        {!n.isRead && <button onClick={() => handleReadNotification(n.id)} style={{padding: '2px 5px'}}>Mark read</button>}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="modal-actions">
                            <button onClick={() => setShowNotifications(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showSettings && isAdmin && (
                <div className="modal-overlay" onClick={() => setShowSettings(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>Board Settings</h2>
                        <label>Background Color</label>
                        <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} style={{width: '100%', height: '40px', marginBottom: '20px'}} />
                        
                        <label>Invite Member</label>
                        <div style={{display: 'flex', gap: '5px', marginBottom: '20px'}}>
                            <input type="email" value={inviteEmail} onChange={(e) => setInviteEmail(e.target.value)} placeholder="friend@example.com" style={{flex: 1, padding: '8px', margin: 0}} />
                            <select value={inviteRole} onChange={(e) => setInviteRole(e.target.value)} style={{padding: '8px'}}>
                                <option value="member">Member</option>
                                <option value="admin">Admin</option>
                            </select>
                        </div>
                        
                        <div className="modal-actions">
                            <button onClick={handleSaveSettings}>Save</button>
                            <button onClick={() => setShowSettings(false)}>Close</button>
                        </div>
                    </div>
                </div>
            )}

            {showModal && isAdmin && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h2>New Column</h2>
                        <form onSubmit={handleAddColumn}>
                            <input value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Name" required />
                            <div className="modal-actions">
                                <button type="submit">Add</button>
                                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardPage;