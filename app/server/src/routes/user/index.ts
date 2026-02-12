import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createUserHandler,
    getUsersHandler,
    getUserByIdHandler,
    updateUserHandler,
    deleteUserHandler,
} from './handlers.js';
import {
    createUserSchema,
    getUsersSchema,
    getUserByIdSchema,
    updateUserSchema,
    deleteUserSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createUserSchema }, createUserHandler);

    fastify.get('/', { schema: getUsersSchema }, getUsersHandler);

    fastify.get('/:id', { schema: getUserByIdSchema }, getUserByIdHandler);

    fastify.put('/:id', { schema: updateUserSchema }, updateUserHandler);

    fastify.delete('/:id', { schema: deleteUserSchema }, deleteUserHandler);
}
