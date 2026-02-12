export type EventType = 'meeting' | 'event';

export interface eventMeetingDTO {
    id: number,
    eventName: string,
    eventIndex: number,
    boardColumnId: number,
    description?: string,
    startingDate: Date,
    endingDate: Date,
    duration?: string,
    integration?: string,
    createdBy: number,
    updatedBy?: number,
    type: EventType,
    resume?: string,
    location?: string
}

export interface createEventMeetingDTO {
    eventName: string,
    eventIndex: number,
    boardColumnId: number,
    description?: string,
    startingDate: Date,
    endingDate: Date,
    duration?: string,
    integration?: string,
    createdBy: number,
    type: EventType,
    resume?: string,
    location?: string
}

export interface updateEventMeetingDTO {
    eventName?: string,
    eventIndex?: number,
    boardColumnId?: number,
    description?: string,
    startingDate?: Date,
    endingDate?: Date,
    duration?: string,
    integration?: string,
    updatedBy?: number,
    type?: EventType,
    resume?: string,
    location?: string
}

export interface eventMeetingResponseDTO {
    success: boolean,
    message?: string,
    result?: eventMeetingDTO | eventMeetingDTO[]
}