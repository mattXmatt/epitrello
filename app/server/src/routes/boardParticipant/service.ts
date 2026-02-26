export const boardParticipantService = {
    async addParticipantByEmail(fastify: any, boardId: number, email: string, role: string = 'member') {
        const client = await fastify.pg.connect();
        try {
            const userRes = await client.query('SELECT id FROM "UserInfo" WHERE email = $1', [email]);
            if (userRes.rowCount === 0) return { success: false, message: "User not found" };
            const userId = userRes.rows[0].id;
            const existing = await client.query(
                'SELECT * FROM "BoardParticipant" WHERE "boardId" = $1 AND "participantUserId" = $2',
                [boardId, userId]
            );
            if (existing.rowCount > 0) return { success: false, message: "User already in board" };
            const newPart = await client.query(
                'INSERT INTO "BoardParticipant" ("boardId", "participantUserId", "role") VALUES ($1, $2, $3) RETURNING *',
                [boardId, userId, role]
            );
            return { success: true, result: newPart.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getParticipants(fastify: any, boardId: number) {
        try {
            const parts = await fastify.pg.query(
                `SELECT bp.*, u.name, u.email 
                 FROM "BoardParticipant" bp
                 JOIN "UserInfo" u ON bp."participantUserId" = u.id
                 WHERE bp."boardId" = $1`,
                [boardId]
            );
            return { success: true, result: parts.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async removeParticipant(fastify: any, participantId: number) {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'DELETE FROM "BoardParticipant" WHERE id = $1 RETURNING *',
                [participantId]
            );
            if (result.rowCount === 0) return { success: false, message: 'Participant introuvable' };
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async updateParticipantRole(fastify: any, participantId: number, role: string) {
        const client = await fastify.pg.connect();
        try {
            const result = await client.query(
                'UPDATE "BoardParticipant" SET role = $1 WHERE id = $2 RETURNING *',
                [role, participantId]
            );
            if (result.rowCount === 0) return { success: false, message: 'Participant introuvable' };
            return { success: true, result: result.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    }
};
