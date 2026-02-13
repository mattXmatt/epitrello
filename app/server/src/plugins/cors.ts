import { FastifyPluginAsync } from 'fastify';
import fastifyCors from '@fastify/cors';
import fp from 'fastify-plugin';

const corsPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.register(fastifyCors, {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    credentials: true
  });
};

export default fp(corsPlugin);