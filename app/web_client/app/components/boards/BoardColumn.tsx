"use client"
import React, { useState, useEffect, useRef } from 'react';
import { HexColorPicker } from 'react-colorful';
import TaskCard, { Task } from './TaskCard';
import EventCard, { Event } from './EventCard';
import CreateTaskForm from './CreateTaskForm';
import CreateEventForm from './CreateEventForm';
import TaskDetailModal from './TaskDetailModal';
import EventDetailModal from './EventDetailModal';
import { createTask, createEvent, updateColumn, deleteColumn } from '@/app/services/api';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import './board_column.css';

interface BoardColumnData {
    id: string;
    columnName: string;
    color?: string;
    boardId: string;
    tasks: Task[];
    events: Event[];
}
interface BoardColumnProps {
    column: BoardColumnData;
    onRefreshBoard: () => void;
    isAdmin?: boolean;
}

const IconGrip = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
        <circle cx="9" cy="5" r="1.5"/><circle cx="15" cy="5" r="1.5"/>
        <circle cx="9" cy="12" r="1.5"/><circle cx="15" cy="12" r="1.5"/>
        <circle cx="9" cy="19" r="1.5"/><circle cx="15" cy="19" r="1.5"/>
    </svg>
);
const IconPencil = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
        <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
);
const IconCheck = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"/>
    </svg>
);
const IconX = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
);
const IconTrash = () => (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="3 6 5 6 21 6"/>
        <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
        <path d="M10 11v6M14 11v6"/>
        <path d="M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"/>
    </svg>
);

const DEFAULT_COLOR = '#e8eaf0';

const BoardColumn: React.FC<BoardColumnProps> = ({ column, onRefreshBoard, isAdmin = false }) => {
    const [tasks, setTasks]   = useState<Task[]>(column.tasks || []);
    const [events, setEvents] = useState<Event[]>(column.events || []);

    const [isEditing, setIsEditing]   = useState(false);
    const [colName, setColName]       = useState(column.columnName);
    const [colColor, setColColor]     = useState(column.color || DEFAULT_COLOR);
    const [showColorPicker, setShowColorPicker] = useState(false);
    const colorPickerRef = useRef<HTMLDivElement>(null);

    const [showCreateTask,  setShowCreateTask]  = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedTaskId,  setSelectedTaskId]  = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    useEffect(() => {
        setTasks(column.tasks || []);
        setEvents(column.events || []);
        setColName(column.columnName);
        setColColor(column.color || DEFAULT_COLOR);
    }, [column]);

    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node))
                setShowColorPicker(false);
        };
        if (showColorPicker) document.addEventListener('mousedown', handler);
        return () => document.removeEventListener('mousedown', handler);
    }, [showColorPicker]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id.toString(),
        data: { type: 'Column', column }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.45 : 1,
    };

    const handleSave = async () => {
        setIsEditing(false);
        setShowColorPicker(false);
        await updateColumn(column.id, { columnName: colName, color: colColor });
        onRefreshBoard();
    };
    const handleCancel = () => {
        setIsEditing(false);
        setShowColorPicker(false);
        setColName(column.columnName);
        setColColor(column.color || DEFAULT_COLOR);
    };
    const handleDeleteColumn = async () => {
        if (!confirm(`Supprimer "${colName}" et tout son contenu ?`)) return;
        await deleteColumn(column.id);
        onRefreshBoard();
    };

    const handleAddTask = async (task: Omit<Task, 'id'>) => {
        await createTask(column.id, task);
        setShowCreateTask(false);
        onRefreshBoard();
    };
    const handleAddEvent = async (event: Omit<Event, 'id'>) => {
        await createEvent(column.id, event);
        setShowCreateEvent(false);
        onRefreshBoard();
    };

    const totalCards = tasks.length + events.length;
    const sortableIds = [...events.map(e => e.id.toString()), ...tasks.map(t => t.id.toString())];

    return (
        <div ref={setNodeRef} style={style} className="col-wrap">

            <div className="col-accent" style={{ backgroundColor: colColor }} />

            <div className="col-header">
                <div className="col-drag-handle" {...attributes} {...listeners}>
                    <IconGrip />
                </div>

                {isEditing ? (
                    <div className="col-edit-row">
                        <input
                            className="col-name-input"
                            value={colName}
                            onChange={e => setColName(e.target.value)}
                            autoFocus
                            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') handleCancel(); }}
                        />
                        <div className="col-color-wrap" ref={colorPickerRef}>
                            <button className="col-color-swatch" style={{ backgroundColor: colColor }} onClick={() => setShowColorPicker(v => !v)} type="button" title="Couleur" />
                            {showColorPicker && (
                                <div className="col-color-popover">
                                    <HexColorPicker color={colColor} onChange={setColColor} />
                                </div>
                            )}
                        </div>
                        <button className="col-icon-btn col-icon-btn--save"   onClick={handleSave}><IconCheck /></button>
                        <button className="col-icon-btn col-icon-btn--cancel" onClick={handleCancel}><IconX /></button>
                        {isAdmin && (
                            <button className="col-icon-btn col-icon-btn--delete" onClick={handleDeleteColumn} title="Supprimer la colonne"><IconTrash /></button>
                        )}
                    </div>
                ) : (
                    <>
                        <h2 className="col-title" onClick={() => setIsEditing(true)}>{colName}</h2>
                        <div className="col-header-right">
                            {totalCards > 0 && <span className="col-count">{totalCards}</span>}
                            <button className="col-icon-btn col-icon-btn--edit" onClick={() => setIsEditing(true)} title="Modifier"><IconPencil /></button>
                        </div>
                    </>
                )}
            </div>

            <div className="col-cards">
                <SortableContext items={sortableIds} strategy={verticalListSortingStrategy}>
                    {events.map(event => (
                        <EventCard key={event.id} event={event} onClick={() => setSelectedEventId(event.id)} />
                    ))}
                    {tasks.map(task => (
                        <TaskCard key={task.id} task={task} onClick={() => setSelectedTaskId(task.id)} />
                    ))}
                </SortableContext>
                {totalCards === 0 && (
                    <div className="col-empty"><span>Aucune carte</span></div>
                )}
            </div>

            <div className="col-footer">
                <button className="col-add-btn" onClick={() => setShowCreateTask(true)}>+ Tâche</button>
                <button className="col-add-btn col-add-btn--event" onClick={() => setShowCreateEvent(true)}>+ Événement</button>
            </div>

            {showCreateTask && <div className="modal-overlay"><div className="modal-content"><h2>Nouvelle tâche</h2><CreateTaskForm columnId={column.id} onAddTask={handleAddTask} onClose={() => setShowCreateTask(false)} /></div></div>}
            {showCreateEvent && <div className="modal-overlay"><div className="modal-content"><h2>Nouvel événement</h2><CreateEventForm columnId={column.id} onAddEvent={handleAddEvent} onClose={() => setShowCreateEvent(false)} /></div></div>}
            {selectedTaskId && <TaskDetailModal taskId={selectedTaskId} boardId={column.boardId} columnId={column.id} onClose={() => setSelectedTaskId(null)} onUpdate={onRefreshBoard} onDelete={onRefreshBoard} onMove={onRefreshBoard} />}
            {selectedEventId && <EventDetailModal eventId={selectedEventId} boardId={column.boardId} columnId={column.id} onClose={() => setSelectedEventId(null)} onUpdate={onRefreshBoard} onDelete={onRefreshBoard} onMove={onRefreshBoard} />}
        </div>
    );
};

export default BoardColumn;
