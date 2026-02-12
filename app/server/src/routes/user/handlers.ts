import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import bcrypt from 'bcrypt';
import { userService } from './service.js';
import { createUserDTO, updateUserDTO } from './interfaces.js';


export const createUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const userData = request.body as createUserDTO;
    if (userData.password) {
        const hashedPassword = await bcrypt.hash(userData.password, 12);
        userData.password = hashedPassword;
    }
    const response = await userService.createUser(fastify, userData);
    if (response.success) {
          reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getUsersHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const response = await userService.getUsers(fastify);
    reply.send(response);
};

export const getUserByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await userService.getUserById(fastify, id);

    reply.send(response);
};

export const updateUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const userData = request.body as updateUserDTO;
    const user = await userService.getUserById(fastify, id);

    if (!user.success || !user.result || Array.isArray(user.result)) {
        return reply.code(404).send({ success: false, message: "Utilisateur non trouvé" });
    }

    userData.name = userData.name || user.result.name;
    userData.surname = userData.surname || user.result.surname;
    userData.email = userData.email || user.result.email;

    const response = await userService.updateUser(fastify, id, userData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteUserHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await userService.deleteUser(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};