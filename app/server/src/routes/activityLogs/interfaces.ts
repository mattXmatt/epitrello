export type LogEntity = 'task' | 'board' | 'documentation' | 'board_column' | 'board_settings' | 'user';
export type LogAction = 'create' | 'delete' | 'update' | 'assign_user' | 'add_user';

export interface activityLogDTO {
    id: number,
    logName: string,
    userId: number,
    boardId: number,
    entityType: LogEntity,
    entityId: number,
    action: LogAction,
    detail?: any,
    createdAt: Date
}

export interface createActivityLogDTO {
    logName: string,
    userId: number,
    boardId: number,
    entityType: LogEntity,
    entityId: number,
    action: LogAction,
    detail?: any
}

export interface activityLogResponseDTO {
    success: boolean,
    message?: string,
    result?: activityLogDTO | activityLogDTO[]
}