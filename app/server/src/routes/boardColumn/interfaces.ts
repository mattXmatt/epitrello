export interface boardColumnDTO {
    id: number,
    columnName: string,
    description?: string,
    boardId: number,
    columnIndex: number
}

export interface createBoardColumnDTO {
    columnName: string,
    description?: string,
    boardId: number,
    columnIndex: number
}

export interface updateBoardColumnDTO {
    columnName?: string,
    description?: string,
    columnIndex?: number
}

export interface boardColumnResponseDTO {
    success: boolean,
    message?: string,
    result?: boardColumnDTO | boardColumnDTO[]
}