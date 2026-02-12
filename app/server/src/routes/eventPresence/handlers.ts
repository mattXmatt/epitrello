import { FastifyReply, FastifyRequest } from 'fastify';
import { eventPresenceService } from './service.js';

export const updatePresenceHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { eventId, userId, status } = request.body as { eventId: number, userId: number, status: string };
    const response = await eventPresenceService.updatePresence(fastify, eventId, userId, status);
    reply.send(response);
};

export const getPresenceHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { eventId } = request.params as { eventId: number };
    const response = await eventPresenceService.getEventPresence(fastify, eventId);
    reply.send(response);
};