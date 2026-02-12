import { FastifyReply, FastifyRequest } from 'fastify';
import { boardParticipantService } from './service.js';
import { createBoardParticipantDTO, updateBoardParticipantDTO } from './interfaces.js';

export const createBoardParticipantHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const boardParticipantData = request.body as createBoardParticipantDTO;
    const response = await boardParticipantService.createBoardParticipant(fastify, boardParticipantData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getBoardParticipantsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.query as { boardId: number };
    const response = await boardParticipantService.getBoardParticipants(fastify, boardId);
    reply.send(response);
};

export const getBoardParticipantByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardParticipantService.getBoardParticipantById(fastify, id);
    reply.send(response);
};

export const updateBoardParticipantHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const boardParticipantData = request.body as updateBoardParticipantDTO;
    const response = await boardParticipantService.updateBoardParticipant(fastify, id, boardParticipantData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteBoardParticipantHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardParticipantService.deleteBoardParticipant(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};