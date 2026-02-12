import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import { createAssigneeHandler, deleteAssigneeHandler } from './handlers.js';
import { createAssigneeSchema, deleteAssigneeSchema } from './schemas.js';

export default async function (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/', { schema: createAssigneeSchema, onRequest: [fastify.authenticate] }, createAssigneeHandler);
    fastify.delete('/', { schema: deleteAssigneeSchema, onRequest: [fastify.authenticate] }, deleteAssigneeHandler);
}