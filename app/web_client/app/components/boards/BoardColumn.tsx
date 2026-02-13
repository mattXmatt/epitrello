"use client"
import React, { useState } from 'react';
import TaskCard, { Task } from './TaskCard';
import EventCard, { Event } from './EventCard';
import CreateTaskForm from './CreateTaskForm';
import CreateEventForm from './CreateEventForm';
import TaskDetailModal from './TaskDetailModal';
import EventDetailModal from './EventDetailModal';
import { createTask, createEvent } from '@/app/services/api';
import './board_column.css';

interface BoardColumnData {
    id: string;
    columnName: string;
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
    
    const [showCreateTask, setShowCreateTask] = useState(false);
    const [showCreateEvent, setShowCreateEvent] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
    const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

    const handleAddTask = async (task: Omit<Task, 'id'>) => {
        try {
            const newTask = await createTask(column.id, task);
            setTasks(prev => [...prev, newTask]);
            setShowCreateTask(false);
        } catch (error) { console.error(error); }
    };

    const handleAddEvent = async (event: Omit<Event, 'id'>) => {
        try {
            const newEvent = await createEvent(column.id, event);
            setEvents(prev => [...(prev || []), newEvent]);
            setShowCreateEvent(false);
        } catch (error) { console.error(error); }
    };

    const onTaskUpdate = (updated: Task) => {
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    };
    const onTaskDelete = (id: string) => {
        setTasks(prev => prev.filter(t => t.id !== id));
    };

    const onEventUpdate = (updated: Event) => {
        setEvents(prev => prev.map(e => e.id === updated.id ? updated : e));
    };
    const onEventDelete = (id: string) => {
        setEvents(prev => prev.filter(e => e.id !== id));
    };

    return (
        <div className="board-column">
            <h2>{column.columnName}</h2>
            <div className="tasks-container">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onClick={() => setSelectedTaskId(task.id)} />
                ))}
                {events?.map(event => (
                    <EventCard key={event.id} event={event} onClick={() => setSelectedEventId(event.id)} />
                ))}
            </div>
            
            <div className="column-actions">
                <button onClick={() => setShowCreateTask(true)} className="add-task-btn">+ Task</button>
                <button onClick={() => setShowCreateEvent(true)} className="add-event-btn">+ Event</button>
            </div>

            {showCreateTask && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Task</h2>
                        <CreateTaskForm columnId={column.id} onAddTask={handleAddTask} onClose={() => setShowCreateTask(false)} />
                    </div>
                </div>
            )}
            {showCreateEvent && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>New Event</h2>
                        <CreateEventForm columnId={column.id} onAddEvent={handleAddEvent} onClose={() => setShowCreateEvent(false)} />
                    </div>
                </div>
            )}

            {selectedTaskId && (
                <TaskDetailModal 
                    taskId={selectedTaskId} 
                    boardId={column.boardId}
                    columnId={column.id}
                    onClose={() => setSelectedTaskId(null)}
                    onUpdate={onTaskUpdate}
                    onDelete={onTaskDelete}
                    onMove={onRefreshBoard}
                />
            )}
            {selectedEventId && (
                <EventDetailModal 
                    eventId={selectedEventId} 
                    boardId={column.boardId}
                    columnId={column.id}
                    onClose={() => setSelectedEventId(null)}
                    onUpdate={onEventUpdate}
                    onDelete={onEventDelete}
                    onMove={onRefreshBoard}
                />
            )}
        </div>
    );
};

export default BoardColumn;