import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createDocumentationHandler,
    getDocumentationsHandler,
    getDocumentationByIdHandler,
    updateDocumentationHandler,
    deleteDocumentationHandler,
} from './handlers.js';
import {
    createDocumentationSchema,
    getDocumentationsSchema,
    getDocumentationByIdSchema,
    updateDocumentationSchema,
    deleteDocumentationSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createDocumentationSchema }, createDocumentationHandler);

    fastify.get('/', { schema: getDocumentationsSchema }, getDocumentationsHandler);

    fastify.get('/:id', { schema: getDocumentationByIdSchema }, getDocumentationByIdHandler);

    fastify.put('/:id', { schema: updateDocumentationSchema }, updateDocumentationHandler);

    fastify.delete('/:id', { schema: deleteDocumentationSchema }, deleteDocumentationHandler);
}
