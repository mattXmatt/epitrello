import { FastifyReply, FastifyRequest } from 'fastify';
import { eventMeetingService } from './service.js';
import { createEventMeetingDTO, updateEventMeetingDTO } from './interfaces.js';

export const createEventMeetingHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const eventMeetingData = request.body as createEventMeetingDTO;
    const response = await eventMeetingService.createEventMeeting(fastify, eventMeetingData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getEventMeetingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardColumnId } = request.query as { boardColumnId: number };
    const response = await eventMeetingService.getEventMeetings(fastify, boardColumnId);
    reply.send(response);
};

export const getEventMeetingByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await eventMeetingService.getEventMeetingById(fastify, id);
    reply.send(response);
};

export const updateEventMeetingHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const eventMeetingData = request.body as updateEventMeetingDTO;
    const response = await eventMeetingService.updateEventMeeting(fastify, id, eventMeetingData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteEventMeetingHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await eventMeetingService.deleteEventMeeting(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};