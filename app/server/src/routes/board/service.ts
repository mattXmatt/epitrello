import { createBoardDTO, updateBoardDTO, boardResponseDTO } from "./interfaces.js";

export const boardService = {
    async createBoard(fastify: any, data: createBoardDTO, userId: number): Promise<boardResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            await client.query('BEGIN');

            const settingsRes = await client.query(
                'INSERT INTO "BoardSettings" ("backgroundColor") VALUES (\'#FFFFFF\') RETURNING id'
            );
            const settingsId = settingsRes.rows[0].id;

            const docRes = await client.query(
                'INSERT INTO "Documentation" ("documentName", "content", "createdBy") VALUES ($1, \'\', $2) RETURNING id',
                [`Documentation for ${data.boardName}`, userId]
            );
            const docId = docRes.rows[0].id;

            const boardRes = await client.query(
                'INSERT INTO "Board" ("boardName", "description", "createdBy", "boardSettingsId", "documentationSectionId") VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [data.boardName, data.description, userId, settingsId, docId]
            );
            const newBoard = boardRes.rows[0];

            await client.query('UPDATE "BoardSettings" SET "boardId" = $1 WHERE id = $2', [newBoard.id, settingsId]);
            await client.query('UPDATE "Documentation" SET "boardId" = $1 WHERE id = $2', [newBoard.id, docId]);

            await client.query('COMMIT');
            return { success: true, result: newBoard };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getBoards(fastify: any): Promise<boardResponseDTO> {
        const boards = await fastify.pg.query('SELECT * FROM "Board"');
        return { success: true, result: boards.rows };
    },

    async getBoardById(fastify: any, id: number): Promise<boardResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            const { rows } = await client.query('SELECT get_board_details($1) as board', [id]);

            if (rows.length === 0 || !rows[0].board) {
                return { success: false, message: 'Board not found' };
            }

            return { success: true, result: rows[0].board };
        } catch (error: any) {
            fastify.log.error(error);
            return { success: false, message: 'Internal Server Error' };
        } finally {
            client.release();
        }
    },

    async updateBoard(fastify: any, id: number, data: updateBoardDTO): Promise<boardResponseDTO> {
        const board = await fastify.pg.query(
            'UPDATE "Board" SET "boardName" = $1, "description" = $2, "updatedAt" = CURRENT_TIMESTAMP WHERE id = $3 RETURNING *',
            [data.boardName, data.description, id]
        );
        return { success: true, result: board.rows[0] };
    },

    async deleteBoard(fastify: any, id: number): Promise<boardResponseDTO> {
        await fastify.pg.query('DELETE FROM "Board" WHERE id = $1', [id]);
        return { success: true, message: 'Board deleted successfully' };
    }
};