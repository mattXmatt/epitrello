import { createBoardParticipantDTO, updateBoardParticipantDTO, boardParticipantResponseDTO } from "./interfaces.js";

export const boardParticipantService = {
    async createBoardParticipant(fastify: any, data: createBoardParticipantDTO): Promise<boardParticipantResponseDTO> {
        try {
            const newBoardParticipant = await fastify.pg.query(
                'INSERT INTO "BoardParticipant" ("boardId", "participantUserId", "role") VALUES ($1, $2, $3) RETURNING *',
                [data.boardId, data.participantUserId, data.role]
            );
            return { success: true, result: newBoardParticipant.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardParticipants(fastify: any, boardId: number): Promise<boardParticipantResponseDTO> {
        try {
            const boardParticipants = await fastify.pg.query(
                'SELECT * FROM "BoardParticipant" WHERE "boardId" = $1',
                [boardId]
            );
            return { success: true, result: boardParticipants.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardParticipantById(fastify: any, id: number): Promise<boardParticipantResponseDTO> {
        try {
            const boardParticipant = await fastify.pg.query(
                'SELECT * FROM "BoardParticipant" WHERE id = $1',
                [id]
            );
            return { success: true, result: boardParticipant.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardParticipant(fastify: any, id: number, data: updateBoardParticipantDTO): Promise<boardParticipantResponseDTO> {
        try {
            const boardParticipant = await fastify.pg.query(
                'UPDATE "BoardParticipant" SET "role" = $1 WHERE id = $2 RETURNING *',
                [data.role, id]
            );
            return { success: true, result: boardParticipant.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteBoardParticipant(fastify: any, id: number): Promise<boardParticipantResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "BoardParticipant" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'BoardParticipant deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}