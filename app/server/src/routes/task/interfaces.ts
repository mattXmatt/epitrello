export type Priority = 'P0' | 'P1' | 'P2' | 'None';
import { TaskDTO } from "../board/interfaces.js";

export interface taskDTO {
    id: number,
    taskName: string,
    taskIndex: number,
    boardColumnId: number,
    description?: string,
    startingDate: Date,
    endingDate?: Date,
    duration?: number,
    integrations?: string,
    createdBy: number,
    updatedBy?: number,
    priority: Priority,
    comment?: any,
    stepsChecklist?: any
}

export interface createTaskDTO {
    taskName: string,
    taskIndex: number,
    boardColumnId: number,
    description?: string,
    startingDate: Date,
    endingDate?: Date,
    duration?: number,
    integrations?: string,
    createdBy: number,
    priority: Priority,
    comment?: any,
    stepsChecklist?: any
    boardColumnId: number;
    taskName: string;
    description?: string;
    priority?: 'P0' | 'P1' | 'P2' | 'None';
}

export interface updateTaskDTO {
    taskName?: string,
    taskIndex?: number,
    boardColumnId?: number,
    description?: string,
    startingDate?: Date,
    endingDate?: Date,
    duration?: number,
    integrations?: string,
    updatedBy?: number,
    priority?: Priority,
    comment?: any,
    stepsChecklist?: any
}

export interface taskResponseDTO {
    success: boolean,
    message?: string,
    result?: taskDTO | taskDTO[]
    result?: TaskDTO | TaskDTO[]
}