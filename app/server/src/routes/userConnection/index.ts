import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createUserConnectionHandler,
    getUserConnectionsHandler,
    getUserConnectionByIdHandler,
    updateUserConnectionHandler,
    deleteUserConnectionHandler,
} from './handlers.js';
import {
    createUserConnectionSchema,
    getUserConnectionsSchema,
    getUserConnectionByIdSchema,
    updateUserConnectionSchema,
    deleteUserConnectionSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createUserConnectionSchema }, createUserConnectionHandler);

    fastify.get('/', { schema: getUserConnectionsSchema }, getUserConnectionsHandler);

    fastify.get('/:id', { schema: getUserConnectionByIdSchema }, getUserConnectionByIdHandler);

    fastify.put('/:id', { schema: updateUserConnectionSchema }, updateUserConnectionHandler);

    fastify.delete('/:id', { schema: deleteUserConnectionSchema }, deleteUserConnectionHandler);
}