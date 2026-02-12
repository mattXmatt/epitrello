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
