import { FastifyInstance } from 'fastify';
import { updatePresenceHandler, getPresenceHandler } from './handlers.js';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', { onRequest: [fastify.authenticate] }, updatePresenceHandler);
    fastify.get('/:eventId', { onRequest: [fastify.authenticate] }, getPresenceHandler);
}