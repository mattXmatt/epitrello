import { FastifyReply, FastifyRequest } from 'fastify';
import { cardTagService } from './service.js';
import { createCardTagDTO } from './interfaces.js';

export const createCardTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const cardTagData = request.body as createCardTagDTO;
    const response = await cardTagService.createCardTag(fastify, cardTagData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getCardTagsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { cardId, cardType } = request.query as { cardId: number, cardType: string };
    const response = await cardTagService.getCardTags(fastify, cardId, cardType);
    reply.send(response);
};

export const deleteCardTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await cardTagService.deleteCardTag(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};