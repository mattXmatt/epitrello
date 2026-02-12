import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createAssigneeHandler,
    getAssigneesHandler,
    deleteAssigneeHandler,
} from './handlers.js';
import {
    createAssigneeSchema,
    getAssigneesSchema,
    deleteAssigneeSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createAssigneeSchema }, createAssigneeHandler);

    fastify.get('/', { schema: getAssigneesSchema }, getAssigneesHandler);

    fastify.delete('/:id', { schema: deleteAssigneeSchema }, deleteAssigneeHandler);
}