export interface boardSettingsDTO {
    id: number,
    boardId: number,
    backgroundColor?: string
}

export interface updateBoardSettingsDTO {
    backgroundColor?: string
}

export interface boardSettingsResponseDTO {
    success: boolean,
    message?: string,
    result?: boardSettingsDTO | boardSettingsDTO[]
}