import { FastifyReply, FastifyRequest } from 'fastify';
import { boardService } from './service.js';
import { createBoardDTO, updateBoardDTO } from './interfaces.js';

export const createBoardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const boardData = request.body as createBoardDTO;
    const userId = 1;
    // const userId = ... (middleware)
    const response = await boardService.createBoard(fastify, boardData, userId);
    reply.code(response.success ? 201 : 400).send(response);
};

export const getBoardsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const response = await boardService.getBoards(fastify);
    reply.send(response);
};

export const getBoardByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardService.getBoardById(fastify, id);
    reply.send(response);
};

export const updateBoardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const boardData = request.body as updateBoardDTO;
    const response = await boardService.updateBoard(fastify, id, boardData);
    reply.code(response.success ? 200 : 400).send(response);
};

export const deleteBoardHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardService.deleteBoard(fastify, id);
    reply.code(response.success ? 200 : 400).send(response);
};