import fp from 'fastify-plugin';
import fs from 'fs/promises';
import path from 'path';


export default fp(async (fastify) => {
  fastify.addHook('onReady', async () => {
    if (fastify.pg) {
      fastify.log.info('[DB Init] Lecture et exécution du fichier de schéma (psql-db.sql)...');
      const schemaPath = path.join(process.cwd(), 'psql-db.sql');

      try {
        const sql = await fs.readFile(schemaPath, { encoding: 'utf8' });
        await fastify.pg.query(sql);
        fastify.log.info('[DB Init] Base de données initialisée avec succès.');
      } catch (err: any) {
        fastify.log.error(`[DB Init Error] Impossible de lire ou exécuter psql-db.sql : ${err.message}`);
      }
    }
  });
});