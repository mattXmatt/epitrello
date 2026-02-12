import { FastifyReply, FastifyRequest } from 'fastify';
import { tagService } from './service.js';
import { createTagDTO, updateTagDTO } from './interfaces.js';

export const createTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const tagData = request.body as createTagDTO;
    const response = await tagService.createTag(fastify, tagData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getTagsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.query as { boardId: number };
    const response = await tagService.getTags(fastify, boardId);
    reply.send(response);
};

export const getTagByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await tagService.getTagById(fastify, id);
    reply.send(response);
};

export const updateTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const tagData = request.body as updateTagDTO;
    const response = await tagService.updateTag(fastify, id, tagData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteTagHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await tagService.deleteTag(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};