"use client"
import React, { useState, useEffect } from 'react';
import TaskCard, { Task } from './TaskCard';
import EventCard, { Event } from './EventCard';
import CreateTaskForm from './CreateTaskForm';
import CreateEventForm from './CreateEventForm';
import TaskDetailModal from './TaskDetailModal';
import EventDetailModal from './EventDetailModal';
import { createTask, createEvent, updateColumn } from '@/app/services/api';
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
}

const BoardColumn: React.FC<BoardColumnProps> = ({ column, onRefreshBoard }) => {
    const [tasks, setTasks] = useState<Task[]>(column.tasks || []);
    const [events, setEvents] = useState<Event[]>(column.events || []);

    const [isEditingCol, setIsEditingCol] = useState(false);
    const [colName, setColName] = useState(column.columnName);
    const [colColor, setColColor] = useState(column.color || 'transparent');

    useEffect(() => {
        setTasks(column.tasks || []);
        setEvents(column.events || []);
        setColName(column.columnName);
        setColColor(column.color || 'transparent');
    }, [column]);

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id.toString(),
        data: { type: 'Column', column }
    });

    const style = {
        transform: CSS.Translate.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        backgroundColor: colColor !== 'transparent' ? colColor : '#f4f5f7',
    };

    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const handleSaveColumn = async () => {
        setIsEditingCol(false);
        await updateColumn(column.id, { columnName: colName, color: colColor });
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

    const sortableItemsIds = [...events.map(e => e.id.toString()), ...tasks.map(t => t.id.toString())];

    return (
        <div ref={setNodeRef} style={style} className="board-column">
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '15px' }}>
                <div {...attributes} {...listeners} style={{ cursor: 'grab', padding: '5px', color: '#888', touchAction: 'none' }}>
                    ⣿
                </div>
                
                {isEditingCol ? (
                    <div style={{ display: 'flex', gap: '5px', flex: 1, alignItems: 'center' }}>
                        <input value={colName} onChange={e => setColName(e.target.value)} autoFocus style={{ flex: 1, padding: '4px', borderRadius: '4px', border: '1px solid #0052cc' }} />
                        <input type="color" value={colColor} onChange={e => setColColor(e.target.value)} style={{ width: '30px', height: '30px', padding: 0, border: 'none', cursor: 'pointer', backgroundColor: 'transparent' }} />
                        <button onClick={handleSaveColumn} style={{ background: '#0052cc', color: 'white', border: 'none', padding: '4px 8px', borderRadius: '4px', cursor: 'pointer' }}>OK</button>
                    </div>
                ) : (
                    <h2 onClick={() => setIsEditingCol(true)} style={{ flex: 1, margin: 0, cursor: 'text', fontSize: '1.1em', wordWrap: 'break-word' }}>
                        {colName}
                    </h2>
                )}
            </div>
            
            <div className="tasks-container" style={{minHeight: '100px', display: 'flex', flexDirection: 'column', gap: '8px'}}>
                <SortableContext items={sortableItemsIds} strategy={verticalListSortingStrategy}>
                    {/* Events */}
                    {events.map((event) => (
                        <EventCard key={event.id} event={event} onClick={() => setSelectedEventId(event.id)} />
                    ))}

                    {/* Tasks */}
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={() => setSelectedTaskId(task.id)} />
                    ))}
                </SortableContext>
                
                {tasks.length === 0 && events.length === 0 && (
                    <div style={{height: '60px', border: '2px dashed rgba(0,0,0,0.1)', borderRadius: '8px', margin: '5px 0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: '0.8em'}}>
                        Empty Column
                    </div>
                )}
            </div>
            
            <div className="column-actions">
                <button onClick={() => setShowCreateTask(true)} className="add-task-btn">+ Task</button>
                <button onClick={() => setShowCreateEvent(true)} className="add-event-btn">+ Event</button>
            </div>

            {/* Modales */}
            {showCreateTask && <div className="modal-overlay"><div className="modal-content"><h2>New Task</h2><CreateTaskForm columnId={column.id} onAddTask={handleAddTask} onClose={() => setShowCreateTask(false)} /></div></div>}
            {showCreateEvent && <div className="modal-overlay"><div className="modal-content"><h2>New Event</h2><CreateEventForm columnId={column.id} onAddEvent={handleAddEvent} onClose={() => setShowCreateEvent(false)} /></div></div>}
            {selectedTaskId && <TaskDetailModal taskId={selectedTaskId} boardId={column.boardId} columnId={column.id} onClose={() => setSelectedTaskId(null)} onUpdate={() => onRefreshBoard()} onDelete={() => onRefreshBoard()} onMove={onRefreshBoard} />}
            {selectedEventId && <EventDetailModal eventId={selectedEventId} boardId={column.boardId} columnId={column.id} onClose={() => setSelectedEventId(null)} onUpdate={() => onRefreshBoard()} onDelete={() => onRefreshBoard()} onMove={onRefreshBoard} />}
        </div>
    );
};

export default BoardColumn;