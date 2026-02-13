import { Task } from "@/app/components/boards/TaskCard";
import { Event } from "@/app/components/boards/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Board {
    id: string;
    boardName: string;
    description: string;
    columns: Column[];
    backgroundColor?: string;
}

export interface Column {
    id: string;
    columnName: string;
    boardId: string;
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

// Auth
export const register = async (userData: any) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/auth/register`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(userData) });
    if (!res.ok) throw new Error('Registration failed');
    return res.json();
};

export const login = async (credentials: any) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/auth/login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(credentials) });
    if (!res.ok) throw new Error('Login failed');
    return res.json();
};

export const logout = async () => fetchWithCredentials(`${API_BASE_URL}/auth/logout`, { method: 'POST' });

export const getMe = async (): Promise<User> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/auth/me`);
    const data = await res.json();
    return data.result;
};

// Boards
export const getBoards = async (): Promise<Board[]> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/board`);
    const data = await res.json();
    return data.result;
};

export const createBoard = async (boardName: string, description: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/board`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardName, description }),
    });
    if (!res.ok) throw new Error('Failed to create board');
    return res.json();
};

export const getBoard = async (boardId: string): Promise<Board> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/board/${boardId}`);
    const data = await res.json();
    return data.result;
};

export const updateBoardSettings = async (boardId: string, backgroundColor: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/board/${boardId}/settings`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ backgroundColor }) });
    return res.json();
};

// Columns
export const createColumn = async (boardId: string, columnName: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardColumn`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ boardId, columnName }) });
    const data = await res.json();
    return data.result;
};

// Tasks
export const createTask = async (columnId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/task`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...task, boardColumnId: columnId }) });
    const data = await res.json();
    return data.result;
};

export const getTask = async (taskId: string): Promise<Task> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`);
    const data = await res.json();
    return data.result;
};

export const updateTask = async (taskId: string, updates: Partial<Task>): Promise<Task> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    const data = await res.json();
    return data.result;
};

export const deleteTask = async (taskId: string) => fetchWithCredentials(`${API_BASE_URL}/task/${taskId}`, { method: 'DELETE' });

// Events
export const createEvent = async (columnId: string, event: Omit<Event, 'id'>): Promise<Event> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...event, boardColumnId: columnId }) });
    const data = await res.json();
    return data.result;
};

export const getEvent = async (eventId: string): Promise<Event> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`);
    const data = await res.json();
    return data.result;
};

export const updateEvent = async (eventId: string, updates: Partial<Event>): Promise<Event> => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(updates) });
    const data = await res.json();
    return data.result;
};

export const deleteEvent = async (eventId: string) => fetchWithCredentials(`${API_BASE_URL}/eventMeeting/${eventId}`, { method: 'DELETE' });

// Assign & Presence
export const inviteUser = async (boardId: string, email: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/invite`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ boardId, email }) });
    return res.json();
};

export const getParticipants = async (boardId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/${boardId}`);
    const data = await res.json();
    return data.result;
};

export const assignUser = async (cardId: string, userId: string, cardType: 'task' | 'event') => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/assignee`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId, userId, cardType }) });
    return res.json();
};

export const unassignUser = async (cardId: string, userId: string, cardType: 'task' | 'event') => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/assignee`, { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ cardId, userId, cardType }) });
    return res.json();
};

export const updateEventPresence = async (eventId: string, userId: string, status: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/eventPresence`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ eventId, userId, status }) });
    return res.json();
};