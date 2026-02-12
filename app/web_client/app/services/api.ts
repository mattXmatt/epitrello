import { Task } from "@/app/components/boards/TaskCard";
import { Event } from "@/app/components/boards/EventCard";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Board {
    id: string;
    boardName: string;
    description: string;
    columns: Column[];
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
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
    if (!response.ok) {
        throw new Error('Registration failed');
    }
    return response.json();
};

export const login = async (credentials: any): Promise<any> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
    });
    if (!response.ok) {
        throw new Error('Login failed');
    }
    return response.json();
};

export const logout = async (): Promise<any> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
    });
    if (!response.ok) {
        throw new Error('Logout failed');
    }
    return response.json();
};

export const getMe = async (): Promise<User> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/auth/me`);
    if (!response.ok) {
        throw new Error('Failed to fetch user');
    }
    const data = await response.json();
    return data.result;
};

export const createBoard = async (boardName: string, description: string): Promise<Board> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardName, description }),
    });
    if (!response.ok) {
        throw new Error('Failed to create board');
    }
    const data = await response.json();
    return data.result;
};

export const getBoards = async (): Promise<Board[]> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board`);
    if (!response.ok) {
        throw new Error('Failed to fetch boards');
    }
    const data = await response.json();
    return data.result;
};

export const getBoard = async (boardId: string): Promise<Board> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/board/${boardId}`);
    if (!response.ok) {
        throw new Error('Failed to fetch board');
    }
    const data = await response.json();
    return data.result;
};

export const createColumn = async (boardId: string, columnName: string): Promise<Column> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/boardColumn`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ boardId, columnName }),
    });
    if (!response.ok) {
        throw new Error('Failed to create column');
    }
    return response.json();
};

export const createTask = async (columnId: string, task: Omit<Task, 'id'>): Promise<Task> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/task`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...task, boardColumnId: columnId }),
    });
    if (!response.ok) {
        throw new Error('Failed to create task');
    }
    return response.json();
};

export const createEvent = async (columnId: string, event: Omit<Event, 'id'>): Promise<Event> => {
    const response = await fetchWithCredentials(`${API_BASE_URL}/eventMeeting`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...event, boardColumnId: columnId }),
    });
    if (!response.ok) {
        throw new Error('Failed to create event');
    }
    return response.json();
};