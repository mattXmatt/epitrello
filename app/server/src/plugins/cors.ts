import { FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import fp from 'fastify-plugin';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCors, {
    origin: 'http://localhost:3000',
    credentials: true
  });
};

export default fp(corsPlugin);