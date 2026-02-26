import { Task } from "@/app/components/boards/TaskCard";
import { Event } from "@/app/components/boards/EventCard";

const API_BASE_URL = typeof window !== 'undefined' ? '/api' : (process.env.NEXT_PUBLIC_API_URL || 'http://backend:3001');

export interface Column {
    id: string;
    columnName: string;
    boardId: string;
    color?: string;
    columnIndex?: number;
    tasks: Task[];
    events: Event[];
}

export interface Board {
    id: string;
    boardName: string;
    description: string;
    columns: Column[];
    backgroundColor?: string;
    createdBy: string | number;
}

export interface User {
    id: string;
    email: string;
    username: string;
}

export interface Tag {
    id: string;
    name: string;
    color: string;
}

export interface Comment {
    id: string;
    text: string;
    createdAt: string;
    userName: string;
    userId: string;
}

const fetchWithCredentials = (url: string, options: RequestInit = {}) => {
    options.credentials = 'include';
    return fetch(url, options);
};

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

export const createColumn = async (
  boardId: string,
  columnName: string,
  columnIndex: number
) => {
  const res = await fetchWithCredentials(`${API_BASE_URL}/boardColumn`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ boardId, columnName, columnIndex }),
  });

  if (!res.ok) {
    throw new Error("Failed to create column");
  }

  const data = await res.json();
  return data.result;
};

export const updateColumn = async (columnId: string, updates: Partial<Column>) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardColumn/${columnId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    return res.json();
};

export const deleteColumn = async (columnId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardColumn/${columnId}`, { method: 'DELETE' });
    return res.json();
};

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

export const inviteUser = async (boardId: string, email: string, role: string = 'member') => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/invite`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ boardId, email, role }) });
    return res.json();
};

export const getParticipants = async (boardId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/${boardId}`);
    const data = await res.json();
    return data.result;
};

export const removeParticipant = async (participantId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/${participantId}`, { method: 'DELETE' });
    return res.json();
};

export const updateParticipantRole = async (participantId: string, role: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/boardParticipant/${participantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role }),
    });
    return res.json();
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

export const createTag = async (boardId: string, name: string, color: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/tags`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ boardId, name, color })
    });
    return res.json();
};

export const getBoardTags = async (boardId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/tags?boardId=${boardId}`);
    const data = await res.json();
    return data.result;
};

export const assignTag = async (cardId: string, tagId: string, type: 'task' | 'event') => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/tags/assign`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, tagId, type })
    });
    return res.json();
};

export const unassignTag = async (cardId: string, tagId: string, type: 'task' | 'event') => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/tags/assign`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, tagId, type })
    });
    return res.json();
};

export const addComment = async (cardId: string, cardType: 'task' | 'event', text: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/comments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cardId, cardType, text })
    });
    return res.json();
};

export const deleteComment = async (commentId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/comments/${commentId}`, { method: 'DELETE' });
    return res.json();
};

export const getNotifications = async () => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/notifications`);
    const data = await res.json();
    return data.result;
};

export const markNotificationAsRead = async (notificationId: string) => {
    const res = await fetchWithCredentials(`${API_BASE_URL}/notifications/${notificationId}/read`, { method: 'PUT' });
    return res.json();
};
