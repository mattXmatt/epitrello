export interface documentationDTO {
    id: number,
    boardId: number,
    documentName: string,
    content: string,
    createdAt: Date,
    updatedAt: Date,
    createdBy: number,
    updatedBy: number
}

export interface createDocumentationDTO {
    boardId: number,
    documentName: string,
    content?: string,
    createdBy: number
}

export interface updateDocumentationDTO {
    documentName?: string,
    content?: string,
    updatedBy: number
}

export interface deleteDocumentationDTO {
    id: number
}

export interface documentationResponseDTO {
    success: boolean,
    message?: string,
    result?: documentationDTO | documentationDTO[]
}
