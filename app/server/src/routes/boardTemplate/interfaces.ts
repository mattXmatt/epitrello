export interface boardTemplateDTO {
    id: number,
    createdBy: number,
    templateName: string,
    description?: string,
    templateData: any
}

export interface createBoardTemplateDTO {
    createdBy: number,
    templateName: string,
    description?: string,
    templateData: any
}

export interface updateBoardTemplateDTO {
    templateName?: string,
    description?: string,
    templateData?: any
}

export interface boardTemplateResponseDTO {
    success: boolean,
    message?: string,
    result?: boardTemplateDTO | boardTemplateDTO[]
}