import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createBoardTemplateHandler,
    getBoardTemplatesHandler,
    getBoardTemplateByIdHandler,
    updateBoardTemplateHandler,
    deleteBoardTemplateHandler,
} from './handlers.js';
import {
    createBoardTemplateSchema,
    getBoardTemplatesSchema,
    getBoardTemplateByIdSchema,
    updateBoardTemplateSchema,
    deleteBoardTemplateSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createBoardTemplateSchema }, createBoardTemplateHandler);

    fastify.get('/', { schema: getBoardTemplatesSchema }, getBoardTemplatesHandler);

    fastify.get('/:id', { schema: getBoardTemplateByIdSchema }, getBoardTemplateByIdHandler);

    fastify.put('/:id', { schema: updateBoardTemplateSchema }, updateBoardTemplateHandler);

    fastify.delete('/:id', { schema: deleteBoardTemplateSchema }, deleteBoardTemplateHandler);
}