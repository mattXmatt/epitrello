import { FastifyReply, FastifyRequest } from 'fastify';
import { boardColumnService } from './service.js';
import { createBoardColumnDTO, updateBoardColumnDTO } from './interfaces.js';

export const createBoardColumnHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const boardColumnData = request.body as createBoardColumnDTO;
    const response = await boardColumnService.createBoardColumn(fastify, boardColumnData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getBoardColumnsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.query as { boardId: number };
    const response = await boardColumnService.getBoardColumns(fastify, boardId);
    reply.send(response);
};

export const getBoardColumnByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardColumnService.getBoardColumnById(fastify, id);
    reply.send(response);
};

export const updateBoardColumnHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const boardColumnData = request.body as updateBoardColumnDTO;
    const response = await boardColumnService.updateBoardColumn(fastify, id, boardColumnData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteBoardColumnHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardColumnService.deleteBoardColumn(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};