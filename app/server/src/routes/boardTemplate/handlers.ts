import { FastifyReply, FastifyRequest } from 'fastify';
import { boardTemplateService } from './service.js';
import { createBoardTemplateDTO, updateBoardTemplateDTO } from './interfaces.js';

export const createBoardTemplateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const boardTemplateData = request.body as createBoardTemplateDTO;
    const response = await boardTemplateService.createBoardTemplate(fastify, boardTemplateData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getBoardTemplatesHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const response = await boardTemplateService.getBoardTemplates(fastify);
    reply.send(response);
};

export const getBoardTemplateByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardTemplateService.getBoardTemplateById(fastify, id);
    reply.send(response);
};

export const updateBoardTemplateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const boardTemplateData = request.body as updateBoardTemplateDTO;
    const response = await boardTemplateService.updateBoardTemplate(fastify, id, boardTemplateData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteBoardTemplateHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await boardTemplateService.deleteBoardTemplate(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};