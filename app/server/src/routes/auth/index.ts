import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    registerHandler,
    loginHandler,
    logoutHandler,
    getMeHandler,
} from './handler.js';
import {
    registerSchema,
    loginSchema,
    logoutSchema,
    getMeSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/register', { schema: registerSchema }, registerHandler);
    fastify.post('/login', { schema: loginSchema }, loginHandler);
    fastify.post('/logout', { schema: logoutSchema }, logoutHandler);
    fastify.get('/me', { schema: getMeSchema, preHandler: [fastify.authenticate] }, getMeHandler);
}
