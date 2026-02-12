import { join, dirname } from 'path';
import AutoLoad, { AutoloadPluginOptions } from '@fastify/autoload';
import { FastifyPluginAsync } from 'fastify';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export type AppOptions = {} & Partial<AutoloadPluginOptions>;


const app: FastifyPluginAsync<AppOptions> = async (
    fastify,
    opts
): Promise<void> => {
  fastify.register(AutoLoad, {
    dir: join(__dirname, 'plugins'),
    options: { ...opts },
    matchFilter: (path) => path.endsWith('.ts') || path.endsWith('.js'),
  });

  fastify.register(AutoLoad, {
    dir: join(__dirname, 'routes'),
    options: { ...opts },
    matchFilter: (path) => path.endsWith('.ts') || path.endsWith('.js'),
  });
};

export default app;