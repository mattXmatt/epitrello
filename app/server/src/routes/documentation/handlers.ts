import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { documentationService } from './service.js';
import { createDocumentationDTO, updateDocumentationDTO } from './interfaces.js';

export const createDocumentationHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const documentationData = request.body as createDocumentationDTO;
    const response = await documentationService.createDocumentation(fastify, documentationData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getDocumentationsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const response = await documentationService.getDocumentations(fastify);
    reply.send(response);
};

export const getDocumentationByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await documentationService.getDocumentationById(fastify, id);
    reply.send(response);
};

export const updateDocumentationHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const documentationData = request.body as updateDocumentationDTO;
    const response = await documentationService.updateDocumentation(fastify, id, documentationData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteDocumentationHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await documentationService.deleteDocumentation(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};