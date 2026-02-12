import { FastifyReply, FastifyRequest } from 'fastify';
import { assigneeService } from './service.js';

export const createAssigneeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { userId, cardId, cardType } = request.body as { userId: number, cardId: number, cardType: 'task' | 'event' };
    
    const response = await assigneeService.addAssignee(fastify, userId, cardId, cardType);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteAssigneeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { userId, cardId, cardType } = request.body as { userId: number, cardId: number, cardType: 'task' | 'event' };

    const response = await assigneeService.removeAssignee(fastify, userId, cardId, cardType);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};