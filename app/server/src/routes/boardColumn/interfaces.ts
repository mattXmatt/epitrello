export interface boardColumnDTO {
    id: number;
    columnName: string;
    description?: string;
    boardId: number;
    columnIndex: number;
    color?: string;
}

export interface createBoardColumnDTO {
    columnName: string;
    description?: string;
    boardId: number;
    columnIndex: number;
    color?: string;
}

export interface updateBoardColumnDTO {
    columnName?: string;
    description?: string;
    columnIndex?: number;
    color?: string;
}

export interface boardColumnResponseDTO {
    success: boolean;
    message?: string;
    result?: boardColumnDTO | boardColumnDTO[];
}