import { createBoardDTO, updateBoardDTO, boardResponseDTO } from "./interfaces.js";

export const boardService = {
    async createBoard(fastify: any, data: createBoardDTO, userId: number): Promise<boardResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            await client.query('BEGIN');

            const settingsRes = await client.query(
                'INSERT INTO "BoardSettings" ("backgroundColor") VALUES ($1) RETURNING id',
                ['#ffffff']
            );
            const settingsId = settingsRes.rows[0].id;

            const docRes = await client.query(
                'INSERT INTO "Documentation" ("documentName", "content", "createdBy") VALUES ($1, $2, $3) RETURNING id',
                ['General', 'Documentation du board', userId]
            );
            const docId = docRes.rows[0].id;

            const newBoard = await client.query(
                'INSERT INTO "Board" ("boardName", "description", "boardSettingsId", "documentationSectionId", "createdBy") VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [data.boardName, data.description || '', settingsId, docId, userId]
            );

            await client.query(
                'INSERT INTO "BoardParticipant" ("boardId", "participantUserId", "role") VALUES ($1, $2, $3)',
                [newBoard.rows[0].id, userId, 'admin']
            );

            await client.query('COMMIT');
            return { success: true, result: newBoard.rows[0] };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getBoards(fastify: any, userId: number): Promise<boardResponseDTO> {
        try {
            const boards = await fastify.pg.query(
                `SELECT b.*, bs."backgroundColor" 
                 FROM "Board" b
                 JOIN "BoardParticipant" bp ON b.id = bp."boardId"
                 LEFT JOIN "BoardSettings" bs ON b."boardSettingsId" = bs.id
                 WHERE bp."participantUserId" = $1`,
                [userId]
            );
            return { success: true, result: boards.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardById(fastify: any, id: number): Promise<boardResponseDTO> {
        try {
            const query = `
                SELECT 
                    b.*,
                    bs."backgroundColor",
                    COALESCE(
                        (
                            SELECT json_agg(cols ORDER BY cols."columnIndex")
                            FROM (
                                SELECT 
                                    bc.*,
                                    COALESCE(
                                        (
                                            SELECT json_agg(tsk ORDER BY tsk."taskIndex")
                                            FROM (
                                                SELECT 
                                                    t.*, 
                                                    u.name as "creatorName",
                                                    COALESCE((
                                                        SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name))
                                                        FROM assignee a
                                                        JOIN "UserInfo" ui ON a."userId" = ui.id
                                                        WHERE a."cardId" = t.id AND a."cardType" = 'task'
                                                    ), '[]') as assignees
                                                FROM "Task" t
                                                LEFT JOIN "UserInfo" u ON t."createdBy" = u.id
                                                WHERE t."boardColumnId" = bc.id
                                            ) tsk
                                        ), 
                                        '[]'
                                    ) as tasks,
                                    COALESCE(
                                        (
                                            SELECT json_agg(evt ORDER BY evt."eventIndex")
                                            FROM (
                                                SELECT 
                                                    e.*, 
                                                    u.name as "creatorName",
                                                    COALESCE((
                                                        SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name))
                                                        FROM assignee a
                                                        JOIN "UserInfo" ui ON a."userId" = ui.id
                                                        WHERE a."cardId" = e.id AND a."cardType" = 'event'
                                                    ), '[]') as assignees
                                                FROM "EventMeeting" e
                                                LEFT JOIN "UserInfo" u ON e."createdBy" = u.id
                                                WHERE e."boardColumnId" = bc.id
                                            ) evt
                                        ), 
                                        '[]'
                                    ) as events
                                FROM "boardColumn" bc
                                WHERE bc."boardId" = b.id
                            ) cols
                        ),
                        '[]'
                    ) as columns
                FROM "Board" b
                LEFT JOIN "BoardSettings" bs ON b."boardSettingsId" = bs.id
                WHERE b.id = $1
            `;

            const board = await fastify.pg.query(query, [id]);

            if (board.rows.length === 0) {
                return { success: false, message: "Board not found" };
            }

            return { success: true, result: board.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardSettings(fastify: any, boardId: number, backgroundColor: string): Promise<boardResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            const boardRes = await client.query('SELECT "boardSettingsId" FROM "Board" WHERE id = $1', [boardId]);
            if (boardRes.rowCount === 0) return { success: false, message: "Board not found" };
            
            const settingsId = boardRes.rows[0].boardSettingsId;
            await client.query(
                'UPDATE "BoardSettings" SET "backgroundColor" = $1 WHERE id = $2',
                [backgroundColor, settingsId]
            );
            return { success: true, message: "Settings updated" };
        } catch (error: any) {
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async deleteBoard(fastify: any, id: number): Promise<boardResponseDTO> {
        try {
            await fastify.pg.query('DELETE FROM "Board" WHERE id = $1', [id]);
            return { success: true, message: 'Board deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
};