import { FastifyReply, FastifyRequest } from 'fastify';
import { eventPresenceService } from './service.js';
import { createEventPresenceDTO, updateEventPresenceDTO } from './interfaces.js';

export const createEventPresenceHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const eventPresenceData = request.body as createEventPresenceDTO;
    const response = await eventPresenceService.createEventPresence(fastify, eventPresenceData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getEventPresencesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { eventId } = request.query as { eventId: number };
    const response = await eventPresenceService.getEventPresences(fastify, eventId);
    reply.send(response);
};

export const getEventPresenceByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await eventPresenceService.getEventPresenceById(fastify, id);
    reply.send(response);
};

export const updateEventPresenceHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const eventPresenceData = request.body as updateEventPresenceDTO;
    const response = await eventPresenceService.updateEventPresence(fastify, id, eventPresenceData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteEventPresenceHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await eventPresenceService.deleteEventPresence(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};