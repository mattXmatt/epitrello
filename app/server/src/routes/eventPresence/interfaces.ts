export interface eventPresenceDTO {
    id: number,
    eventId: number,
    userId: number,
    status: string
}

export interface createEventPresenceDTO {
    eventId: number,
    userId: number,
    status: string
}

export interface updateEventPresenceDTO {
    status?: string
}

export interface eventPresenceResponseDTO {
    success: boolean,
    message?: string,
    result?: eventPresenceDTO | eventPresenceDTO[]
}