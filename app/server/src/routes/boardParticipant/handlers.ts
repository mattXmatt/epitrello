import { FastifyReply, FastifyRequest } from 'fastify';
import { boardParticipantService } from './service.js';

export const inviteUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId, email, role } = request.body as { boardId: number, email: string, role?: string };
    const response = await boardParticipantService.addParticipantByEmail(fastify, boardId, email, role);
    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getParticipantsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.params as { boardId: number };
    const response = await boardParticipantService.getParticipants(fastify, boardId);
    reply.send(response);
};

export const removeParticipantHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { participantId } = request.params as { participantId: number };
    const response = await boardParticipantService.removeParticipant(fastify, participantId);
    if (response.success) {
        reply.send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const updateParticipantRoleHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { participantId } = request.params as { participantId: number };
    const { role } = request.body as { role: string };
    const response = await boardParticipantService.updateParticipantRole(fastify, participantId, role);
    if (response.success) {
        reply.send(response);
    } else {
        reply.code(400).send(response);
    }
};
