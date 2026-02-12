import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createEventMeetingHandler,
    getEventMeetingsHandler,
    getEventMeetingByIdHandler,
    updateEventMeetingHandler,
    deleteEventMeetingHandler,
} from './handlers.js';
import {
    createEventMeetingSchema,
    getEventMeetingsSchema,
    getEventMeetingByIdSchema,
    updateEventMeetingSchema,
    deleteEventMeetingSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createEventMeetingSchema }, createEventMeetingHandler);

    fastify.get('/', { schema: getEventMeetingsSchema }, getEventMeetingsHandler);

    fastify.get('/:id', { schema: getEventMeetingByIdSchema }, getEventMeetingByIdHandler);

    fastify.put('/:id', { schema: updateEventMeetingSchema }, updateEventMeetingHandler);

    fastify.delete('/:id', { schema: deleteEventMeetingSchema }, deleteEventMeetingHandler);
}