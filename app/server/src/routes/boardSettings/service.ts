import { updateBoardSettingsDTO, boardSettingsResponseDTO } from "./interfaces.js";

export const boardSettingsService = {
    async getBoardSettingsByBoardId(fastify: any, boardId: number): Promise<boardSettingsResponseDTO> {
        try {
            const boardSettings = await fastify.pg.query(
                'SELECT * FROM "BoardSettings" WHERE "boardId" = $1',
                [boardId]
            );
            return { success: true, result: boardSettings.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardSettings(fastify: any, boardId: number, data: updateBoardSettingsDTO): Promise<boardSettingsResponseDTO> {
        try {
            const boardSettings = await fastify.pg.query(
                'UPDATE "BoardSettings" SET "backgroundColor" = $1 WHERE "boardId" = $2 RETURNING *',
                [data.backgroundColor, boardId]
            );
            return { success: true, result: boardSettings.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}