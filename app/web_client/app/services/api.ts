import { Task } from "@/app/components/boards/TaskCard";
import { Event } from "@/app/components/boards/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Board {
    id: string;
    boardName: string;
    description: string;
    columns: Column[];
    backgroundColor?: string;
    createdBy?: string;
}

export interface Column {
    id: string;
    columnName: string;
    tasks: Task[];
    events: Event[];
}

export interface User {
    id: string;
    email: string;
    username: string;
}

const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
    options.credentials = 'include';
    return fetch(url, options);
};

export const register = async (userData: any): Promise<any> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData),
    });
    if (!response.ok) throw new Error('Registration failed');
    return response.json();
};

export const login = async (credentials: any): Promise<any> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) throw new Error('Login failed');
    return response.json();
};

export const logout = async (): Promise<any> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
    });
    if (!response.ok) throw new Error('Logout failed');
    return response.json();
};

export const getMe = async (): Promise<User> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/me`);
    if (!response.ok) throw new Error('Failed to fetch user');
    const data = await response.json();
    return data.result;
};

export const createBoard = async (boardName: string, description: string): Promise<Board> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardName, description }),
    });
    if (!response.ok) throw new Error('Failed to create board');
    const data = await response.json();
    return data.result;
};

export const getBoards = async (): Promise<Board[]> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board`);
    if (!response.ok) throw new Error('Failed to fetch boards');
    const data = await response.json();
    return data.result;
};

export const getBoard = async (boardId: string): Promise<Board> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board/${boardId}`);
    if (!response.ok) throw new Error('Failed to fetch board');
    const data = await response.json();
    return data.result;
};

export const createColumn = async (boardId: string, columnName: string): Promise<Column> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/boardColumn`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, columnName }),
    });
    if (!response.ok) throw new Error('Failed to create column');
    const data = await response.json();
    return data.result;
};

// --- TÂCHES ---

export const createTask = async (columnId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/task`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...task, boardColumnId: columnId }),
    });
    if (!response.ok) throw new Error('Failed to create task');
    const data = await response.json();
    return data.result;
};

export const getTask = async (taskId: string): Promise<Task> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`);
    if (!response.ok) throw new Error('Failed to fetch task');
    const data = await response.json();
    return data.result;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update task');
    const data = await response.json();
    return data.result;
};

export const deleteTask = async (taskId: string): Promise<void> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete task');
};

// --- ÉVÉNEMENTS ---

export const createEvent = async (columnId: string, event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...event, boardColumnId: columnId }),
    });
    if (!response.ok) throw new Error('Failed to create event');
    const data = await response.json();
    return data.result;
};

export const getEvent = async (eventId: string): Promise<Event> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`);
    if (!response.ok) throw new Error('Failed to fetch event');
    const data = await response.json();
    return data.result;
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<Event> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates),
    });
    if (!response.ok) throw new Error('Failed to update event');
    const data = await response.json();
    return data.result;
};

export const deleteEvent = async (eventId: string): Promise<void> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`, {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete event');
};

// Board Settings
export const updateBoardSettings = async (boardId: string, backgroundColor: string) => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board/${boardId}/settings`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ backgroundColor }),
    });
    return response.json();
};

// Invites
export const inviteUser = async (boardId: string, email: string) => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/invite`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, email }),
    });
    return response.json();
};

export const getParticipants = async (boardId: string) => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/${boardId}`);
    const data = await response.json();
    return data.result;
};

// Assignations
export const assignUser = async (cardId: string, userId: string, cardType: 'task' | 'event' = 'task') => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/assignee`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, userId, cardType }),
    });
    return response.json();
};

export const unassignUser = async (cardId: string, userId: string, cardType: 'task' | 'event' = 'task') => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/assignee`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, userId, cardType }),
    });
    return response.json();
};

// Event Presence

export const updateEventPresence = async (eventId: string, userId: string, status: string) => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventPresence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eventId, userId, status }),
    });
    return response.json();
};