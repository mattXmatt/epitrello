import { FastifyReply, FastifyRequest } from 'fastify';
import { assigneeService } from './service.js';
import { createAssigneeDTO } from './interfaces.js';

export const createAssigneeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const assigneeData = request.body as createAssigneeDTO;
    const response = await assigneeService.createAssignee(fastify, assigneeData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getAssigneesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { cardId, cardType } = request.query as { cardId: number, cardType: string };
    const response = await assigneeService.getAssignees(fastify, cardId, cardType);
    reply.send(response);
};

export const deleteAssigneeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await assigneeService.deleteAssignee(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};