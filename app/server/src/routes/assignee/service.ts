export const assigneeService = {
    async addAssignee(fastify: any, userId: number, cardId: number, cardType: string) {
        try {
            await fastify.pg.query(
                'INSERT INTO "assignee" ("userId", "cardId", "cardType") VALUES ($1, $2, $3) ON CONFLICT DO NOTHING',
                [userId, cardId, cardType]
            );
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async removeAssignee(fastify: any, userId: number, cardId: number, cardType: string) {
        try {
            await fastify.pg.query(
                'DELETE FROM "assignee" WHERE "userId" = $1 AND "cardId" = $2 AND "cardType" = $3',
                [userId, cardId, cardType]
            );
            return { success: true };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
};