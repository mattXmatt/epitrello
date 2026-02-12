import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createEventPresenceHandler,
    getEventPresencesHandler,
    getEventPresenceByIdHandler,
    updateEventPresenceHandler,
    deleteEventPresenceHandler,
} from './handlers.js';
import {
    createEventPresenceSchema,
    getEventPresencesSchema,
    getEventPresenceByIdSchema,
    updateEventPresenceSchema,
    deleteEventPresenceSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createEventPresenceSchema }, createEventPresenceHandler);

    fastify.get('/', { schema: getEventPresencesSchema }, getEventPresencesHandler);

    fastify.get('/:id', { schema: getEventPresenceByIdSchema }, getEventPresenceByIdHandler);

    fastify.put('/:id', { schema: updateEventPresenceSchema }, updateEventPresenceHandler);

    fastify.delete('/:id', { schema: deleteEventPresenceSchema }, deleteEventPresenceHandler);
}