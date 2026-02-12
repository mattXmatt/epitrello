import { createActivityLogDTO, activityLogResponseDTO } from "./interfaces.js";

export const activityLogService = {
    async createActivityLog(fastify: any, data: createActivityLogDTO): Promise<activityLogResponseDTO> {
        try {
            const newActivityLog = await fastify.pg.query(
                'INSERT INTO "ActivityLogs" ("logName", "userId", "boardId", "entityType", "entityId", "action", "detail") VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
                [data.logName, data.userId, data.boardId, data.entityType, data.entityId, data.action, data.detail]
            );
            return { success: true, result: newActivityLog.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getActivityLogs(fastify: any, boardId: number): Promise<activityLogResponseDTO> {
        try {
            const activityLogs = await fastify.pg.query(
                'SELECT * FROM "ActivityLogs" WHERE "boardId" = $1 ORDER BY "createdAt" DESC',
                [boardId]
            );
            return { success: true, result: activityLogs.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}