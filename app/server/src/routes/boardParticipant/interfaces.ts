export type Role = 'admin' | 'member' | 'guest';

export interface boardParticipantDTO {
    id: number,
    boardId: number,
    participantUserId: number,
    role: Role
}

export interface createBoardParticipantDTO {
    boardId: number,
    participantUserId: number,
    role: Role
}

export interface updateBoardParticipantDTO {
    role?: Role
}

export interface boardParticipantResponseDTO {
    success: boolean,
    message?: string,
    result?: boardParticipantDTO | boardParticipantDTO[]
}