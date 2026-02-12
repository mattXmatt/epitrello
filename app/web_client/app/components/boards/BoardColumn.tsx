"use client"
import React, { useState } from 'react';
import TaskCard, { Task } from './TaskCard';
import EventCard, { Event } from './EventCard';
import CreateTaskForm from './CreateTaskForm';
import CreateEventForm from './CreateEventForm';
import { createTask, createEvent } from '@/app/services/api';
import './board_column.css';

interface BoardColumnData {
    id: string;
    columnName: string;
    tasks: Task[];
    events: Event[];
}

interface BoardColumnProps {
    column: BoardColumnData;
}

const BoardColumn: React.FC<BoardColumnProps> = ({ column }) => {
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [tasks, setTasks] = useState(column.tasks || []);
    const [events, setEvents] = useState(column.events || []);

    const handleAddTask = async (task: Omit<Task, 'id'>) => {
        try {
            const newTask = await createTask(column.id, task);
            setTasks(prevTasks => [...prevTasks, newTask]);
            setShowTaskModal(false);
        } catch (error) {
            console.error('Failed to create task', error);
        }
    };

    const handleAddEvent = async (event: Omit<Event, 'id'>) => {
        try {
            const newEvent = await createEvent(column.id, event);
            setEvents(prevEvents => [...(prevEvents || []), newEvent]);
            setShowEventModal(false);
        } catch (error) {
            console.error('Failed to create event', error);
        }
    };

    return (
        <div className="board-column">
            <h2>{column.columnName}</h2>
            <div className="tasks-container">
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} />
                ))}
                {events?.map(event => (
                    <EventCard key={event.id} event={event} />
                ))}
            </div>
            <div className="column-actions">
                <button onClick={() => setShowTaskModal(true)} className="add-task-btn">+ Add Task</button>
                <button onClick={() => setShowEventModal(true)} className="add-event-btn">+ Add Event</button>
            </div>

            {showTaskModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Task</h2>
                        <CreateTaskForm
                            columnId={column.id}
                            onAddTask={handleAddTask}
                            onClose={() => setShowTaskModal(false)}
                        />
                    </div>
                </div>
            )}

            {showEventModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>Add New Event</h2>
                        <CreateEventForm
                            columnId={column.id}
                            onAddEvent={handleAddEvent}
                            onClose={() => setShowEventModal(false)}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default BoardColumn;