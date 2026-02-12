export interface tagDTO {
    id: number,
    boardId: number,
    name: string,
    color: string
}

export interface createTagDTO {
    boardId: number,
    name: string,
    color: string
}

export interface updateTagDTO {
    name?: string,
    color?: string
}

export interface tagResponseDTO {
    success: boolean,
    message?: string,
    result?: tagDTO | tagDTO[]
}