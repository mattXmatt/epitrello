import { FastifyInstance } from 'fastify';

export default async function (fastify: FastifyInstance) {
    
    // Une seule déclaration propre
    fastify.post('/', { onRequest: [(fastify as any).authenticate] }, async (req: any, reply: any) => {
        const { cardId, cardType, text } = req.body;
        const userId = req.user.id;
        const client = await fastify.pg.connect();
        try {
            const res = await client.query(
                `INSERT INTO "Comment" ("cardId", "cardType", "userId", "text") 
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [cardId, cardType, userId, text]
            );
            
            const userRes = await client.query(`SELECT name FROM "UserInfo" WHERE id = $1`, [userId]);
            const comment = { ...res.rows[0], userName: userRes.rows[0].name };
            
            reply.code(201).send({ success: true, result: comment });
        } catch (err: any) { 
            reply.code(500).send({ success: false, message: err.message }); 
        } finally { 
            client.release(); 
        }
    });

    fastify.delete('/:id', { onRequest: [(fastify as any).authenticate] }, async (req: any, reply: any) => {
        const { id } = req.params;
        const userId = req.user.id;
        try {
            await fastify.pg.query(`DELETE FROM "Comment" WHERE id = $1 AND "userId" = $2`, [id, userId]);
            reply.send({ success: true });
        } catch (err: any) { 
            reply.code(500).send({ success: false, message: err.message }); 
        }
    });
}