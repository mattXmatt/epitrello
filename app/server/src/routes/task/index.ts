import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createTaskHandler,
    getTasksHandler,
    getTaskByIdHandler,
    updateTaskHandler,
    deleteTaskHandler,
} from './handlers.js';
import {
    createTaskSchema,
    getTasksSchema,
    getTaskByIdSchema,
    updateTaskSchema,
    deleteTaskSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { 
        schema: createTaskSchema,
        onRequest: [fastify.authenticate]
    }, createTaskHandler);

    fastify.get('/', { schema: getTasksSchema }, getTasksHandler);

    fastify.get('/:id', { schema: getTaskByIdSchema }, getTaskByIdHandler);

    fastify.put('/:id', { schema: updateTaskSchema }, updateTaskHandler);

    fastify.delete('/:id', { schema: deleteTaskSchema }, deleteTaskHandler);
}