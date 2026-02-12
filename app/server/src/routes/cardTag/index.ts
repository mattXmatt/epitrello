import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createCardTagHandler,
    getCardTagsHandler,
    deleteCardTagHandler,
} from './handlers.js';
import {
    createCardTagSchema,
    getCardTagsSchema,
    deleteCardTagSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createCardTagSchema }, createCardTagHandler);

    fastify.get('/', { schema: getCardTagsSchema }, getCardTagsHandler);

    fastify.delete('/:id', { schema: deleteCardTagSchema }, deleteCardTagHandler);
}