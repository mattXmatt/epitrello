import { FastifyReply, FastifyRequest } from 'fastify';
import { boardService } from './service.js';
import { createBoardDTO } from './interfaces.js';

export const createBoardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const boardData = request.body as createBoardDTO;
    const user = request.user as { id: number };
    const response = await boardService.createBoard(fastify, boardData, user.id);
    reply.code(response.success ? 201 : 400).send(response);
};

export const getBoardsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const user = request.user as { id: number };
    const response = await boardService.getBoards(fastify, user.id);
    reply.send(response);
};

export const getBoardByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardService.getBoardById(fastify, id);
    reply.send(response);
};

export const updateBoardSettingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const { backgroundColor } = request.body as { backgroundColor: string };
    const response = await boardService.updateBoardSettings(fastify, id, backgroundColor);
    reply.send(response);
};

export const deleteBoardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardService.deleteBoard(fastify, id);
    reply.send(response);
};