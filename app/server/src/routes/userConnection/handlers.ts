import { FastifyReply, FastifyRequest } from 'fastify';
import { userConnectionService } from './service.js';
import { createUserConnectionDTO, updateUserConnectionDTO } from './interfaces.js';

export const createUserConnectionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const userConnectionData = request.body as createUserConnectionDTO;
    const response = await userConnectionService.createUserConnection(fastify, userConnectionData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getUserConnectionsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const response = await userConnectionService.getUserConnections(fastify);
    reply.send(response);
};

export const getUserConnectionByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await userConnectionService.getUserConnectionById(fastify, id);
    reply.send(response);
};

export const updateUserConnectionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const userConnectionData = request.body as updateUserConnectionDTO;
    const response = await userConnectionService.updateUserConnection(fastify, id, userConnectionData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteUserConnectionHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await userConnectionService.deleteUserConnection(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};