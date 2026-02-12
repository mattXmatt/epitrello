import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { inviteUserHandler, getParticipantsHandler } from './handlers.js';

export default async function (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/invite', { onRequest: [fastify.authenticate] }, inviteUserHandler);
    
    fastify.get('/:boardId', { onRequest: [fastify.authenticate] }, getParticipantsHandler);
}