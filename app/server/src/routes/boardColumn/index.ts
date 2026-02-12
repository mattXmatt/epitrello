import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createBoardColumnHandler,
    getBoardColumnsHandler,
    getBoardColumnByIdHandler,
    updateBoardColumnHandler,
    deleteBoardColumnHandler,
} from './handlers.js';
import {
    createBoardColumnSchema,
    getBoardColumnsSchema,
    getBoardColumnByIdSchema,
    updateBoardColumnSchema,
    deleteBoardColumnSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createBoardColumnSchema }, createBoardColumnHandler);

    fastify.get('/', { schema: getBoardColumnsSchema }, getBoardColumnsHandler);

    fastify.get('/:id', { schema: getBoardColumnByIdSchema }, getBoardColumnByIdHandler);

    fastify.put('/:id', { schema: updateBoardColumnSchema }, updateBoardColumnHandler);

    fastify.delete('/:id', { schema: deleteBoardColumnSchema }, deleteBoardColumnHandler);
}