export interface TaskDTO {
    id: number;
    taskName: string;
    taskIndex: number;
    boardColumnId: number;
    description: string | null;
    startingDate: Date;
    endingDate: Date | null;
    duration: number | null;
    integrations: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    createdBy: number;
    updatedBy: number | null;
    priority: 'P0' | 'P1' | 'P2' | 'None';
    comment: any | null;
    stepsChecklist: any | null;
}

export interface EventDTO {
    id: number;
    eventName: string;
    eventIndex: number;
    boardColumnId: number;
    description: string | null;
    startingDate: Date;
    endingDate: Date | null;
    duration: string | null;
    integration: string | null;
    createdAt: Date;
    updatedAt: Date | null;
    createdBy: number;
    updatedBy: number | null;
    type: 'meeting' | 'event';
    resume: string | null;
    location: string | null;
}

export interface ColumnDTO {
    id: number;
    columnName: string;
    description: string | null;
    boardId: number;
    columnIndex: number;
    tasks: TaskDTO[];
    events: EventDTO[];
}

export interface boardDTO {
    id: number,
    boardName: string,
    description?: string | null,
    boardSettingsId: number,
    documentationSectionId: number,
    createdBy: number,
    columns?: ColumnDTO[],
}

export interface createBoardDTO {
    boardName: string,
    description?: string
}

export interface updateBoardDTO {
    boardName?: string,
    description?: string,
    boardSettingsId?: number,
    documentationSectionId?: number
}

export interface boardResponseDTO {
    success: boolean,
    message?: string,
    result?: boardDTO | boardDTO[]
}