import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createActivityLogHandler,
    getActivityLogsHandler,
} from './handlers.js';
import {
    createActivityLogSchema,
    getActivityLogsSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createActivityLogSchema }, createActivityLogHandler);

    fastify.get('/', { schema: getActivityLogsSchema }, getActivityLogsHandler);
}