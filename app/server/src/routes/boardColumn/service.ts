import { createBoardColumnDTO, updateBoardColumnDTO, boardColumnResponseDTO } from "./interfaces.js";

export const boardColumnService = {
    async createBoardColumn(fastify: any, data: createBoardColumnDTO): Promise<boardColumnResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            await client.query('BEGIN');

            const maxIndexRes = await client.query('SELECT MAX("columnIndex") as max_index FROM "boardColumn" WHERE "boardId" = $1', [data.boardId]);
            const nextIndex = (maxIndexRes.rows[0].max_index || 0) + 1;

            const newBoardColumn = await client.query(
                'INSERT INTO "boardColumn" ("columnName", "description", "boardId", "columnIndex") VALUES ($1, $2, $3, $4) RETURNING *',
                [data.columnName, data.description, data.boardId, nextIndex]
            );

            await client.query('COMMIT');
            return { success: true, result: newBoardColumn.rows[0] };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getBoardColumns(fastify: any, boardId: number): Promise<boardColumnResponseDTO> {
        try {
            const boardColumns = await fastify.pg.query(
                'SELECT * FROM "boardColumn" WHERE "boardId" = $1 ORDER BY "columnIndex"',
                [boardId]
            );
            return { success: true, result: boardColumns.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardColumnById(fastify: any, id: number): Promise<boardColumnResponseDTO> {
        try {
            const boardColumn = await fastify.pg.query(
                'SELECT * FROM "boardColumn" WHERE id = $1',
                [id]
            );
            return { success: true, result: boardColumn.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardColumn(fastify: any, id: number, data: updateBoardColumnDTO): Promise<boardColumnResponseDTO> {
        try {
            const boardColumn = await fastify.pg.query(
                'UPDATE "boardColumn" SET "columnName" = $1, "description" = $2, "columnIndex" = $3 WHERE id = $4 RETURNING *',
                [data.columnName, data.description, data.columnIndex, id]
            );
            return { success: true, result: boardColumn.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteBoardColumn(fastify: any, id: number): Promise<boardColumnResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "boardColumn" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'BoardColumn deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}