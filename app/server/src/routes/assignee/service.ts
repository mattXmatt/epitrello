import { createAssigneeDTO, assigneeResponseDTO } from "./interfaces.js";

export const assigneeService = {
    async createAssignee(fastify: any, data: createAssigneeDTO): Promise<assigneeResponseDTO> {
        try {
            const newAssignee = await fastify.pg.query(
                'INSERT INTO "assignee" ("userId", "cardId", "cardType") VALUES ($1, $2, $3) RETURNING *',
                [data.userId, data.cardId, data.cardType]
            );
            return { success: true, result: newAssignee.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getAssignees(fastify: any, cardId: number, cardType: string): Promise<assigneeResponseDTO> {
        try {
            const assignees = await fastify.pg.query(
                'SELECT * FROM "assignee" WHERE "cardId" = $1 AND "cardType" = $2',
                [cardId, cardType]
            );
            return { success: true, result: assignees.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteAssignee(fastify: any, id: number): Promise<assigneeResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "assignee" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'Assignee deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}