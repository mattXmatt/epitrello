import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createBoardHandler,
    getBoardsHandler,
    getBoardByIdHandler,
    updateBoardHandler,
    deleteBoardHandler,
} from './handlers.js';
import {
    createBoardSchema,
    getBoardsSchema,
    getBoardByIdSchema,
    updateBoardSchema,
    deleteBoardSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createBoardSchema }, createBoardHandler);

    fastify.get('/', { schema: getBoardsSchema }, getBoardsHandler);

    fastify.get('/:id', { schema: getBoardByIdSchema }, getBoardByIdHandler);

    fastify.put('/:id', { schema: updateBoardSchema }, updateBoardHandler);

    fastify.delete('/:id', { schema: deleteBoardSchema }, deleteBoardHandler);
}