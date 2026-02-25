import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
    
    fastify.get('/', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        const userId = req.user.id;
        const client = await fastify.pg.connect();
        try {
            const res = await client.query(
                `SELECT * FROM "Notification" WHERE "userId" = $1 ORDER BY "createdAt" DESC LIMIT 30`,
                [userId]
            );
            reply.send({ success: true, result: res.rows });
        } catch (err: any) { 
            reply.code(500).send({ success: false, message: err.message }); 
        } finally {
            client.release();
        }
    });

    fastify.put('/:id/read', { onRequest: [fastify.authenticate] }, async (req: any, reply) => {
        const { id } = req.params;
        const userId = req.user.id;
        const client = await fastify.pg.connect();
        try {
            await client.query(
                `UPDATE "Notification" SET "isRead" = TRUE WHERE id = $1 AND "userId" = $2`,
                [id, userId]
            );
            reply.send({ success: true });
        } catch (err: any) { 
            reply.code(500).send({ success: false, message: err.message }); 
        } finally {
            client.release();
        }
    });
}