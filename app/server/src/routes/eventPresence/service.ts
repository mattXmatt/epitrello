export const eventPresenceService = {
    async updatePresence(fastify: any, eventId: number, userId: number, status: string) {
        const client = await fastify.pg.connect();
        try {
            const res = await client.query(
                `INSERT INTO "eventPresence" ("eventId", "userId", "status") 
                 VALUES ($1, $2, $3)
                 ON CONFLICT ("eventId", "userId") 
                 DO UPDATE SET "status" = EXCLUDED."status"
                 RETURNING *`,
                [eventId, userId, status]
            );
            return { success: true, result: res.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getEventPresence(fastify: any, eventId: number) {
        try {
            const res = await fastify.pg.query(
                `SELECT ep.*, u.name, u.email 
                 FROM "eventPresence" ep
                 JOIN "UserInfo" u ON ep."userId" = u.id
                 WHERE ep."eventId" = $1`,
                [eventId]
            );
            return { success: true, result: res.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
};