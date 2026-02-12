export type CardType = 'event' | 'task';

export interface assigneeDTO {
    id: number,
    userId: number,
    cardId: number,
    cardType: CardType
}

export interface createAssigneeDTO {
    userId: number,
    cardId: number,
    cardType: CardType
}

export interface assigneeResponseDTO {
    success: boolean,
    message?: string,
    result?: assigneeDTO | assigneeDTO[]
}