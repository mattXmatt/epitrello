export type CardType = 'event' | 'task';

export interface cardTagDTO {
    id: number,
    cardId: number,
    tagId: number,
    cardType: CardType
}

export interface createCardTagDTO {
    cardId: number,
    tagId: number,
    cardType: CardType
}

export interface cardTagResponseDTO {
    success: boolean,
    message?: string,
    result?: cardTagDTO | cardTagDTO[]
}