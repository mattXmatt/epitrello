import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createTagHandler,
    getTagsHandler,
    getTagByIdHandler,
    updateTagHandler,
    deleteTagHandler,
} from './handlers.js';
import {
    createTagSchema,
    getTagsSchema,
    getTagByIdSchema,
    updateTagSchema,
    deleteTagSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createTagSchema }, createTagHandler);

    fastify.get('/', { schema: getTagsSchema }, getTagsHandler);

    fastify.get('/:id', { schema: getTagByIdSchema }, getTagByIdHandler);

    fastify.put('/:id', { schema: updateTagSchema }, updateTagHandler);

    fastify.delete('/:id', { schema: deleteTagSchema }, deleteTagHandler);
}