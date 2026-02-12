import { FastifyReply, FastifyRequest } from 'fastify';
import { authService } from './service.js';

const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

export const registerHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    fastify.log.info(`Registering user with body: ${JSON.stringify(request.body)}`);
    const body = request.body as any;
    if (body.email) {
        body.email = body.email.trim();
    }
    const { email } = body;
    if (!email || !emailRegex.test(email)) {
        fastify.log.error('Invalid email format');
        return reply.code(400).send({ success: false, message: 'Invalid email format' });
    }
    try {
        const response = await authService.register(fastify, body);
        if (response.success) {
            reply.setCookie('token', response.token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }).code(201).send({ success: true, result: response.result });
        } else {
            reply.code(400).send(response);
        }
    } catch (error: any) {
        fastify.log.error(`Registration error: ${error.message}`);
        reply.code(500).send({ success: false, message: 'Internal Server Error' });
    }
};

export const loginHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    fastify.log.info(`Logging in user with body: ${JSON.stringify(request.body)}`);
    const body = request.body as any;
    if (body.email) {
        body.email = body.email.trim();
    }
    const { email } = body;
    if (!email || !emailRegex.test(email)) {
        fastify.log.error('Invalid email format');
        return reply.code(400).send({ success: false, message: 'Invalid email format' });
    }
    try {
        const response = await authService.login(fastify, body);
        if (response.success) {
            reply.setCookie('token', response.token, {
                path: '/',
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
            }).send({ success: true });
        } else {
            reply.code(401).send(response);
        }
    } catch (error: any) {
        fastify.log.error(`Login error: ${error.message}`);
        reply.code(500).send({ success: false, message: 'Internal Server Error' });
    }
};

export const logoutHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    reply.clearCookie('token', { path: '/' }).send({ success: true });
};

export const getMeHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    try {
        const decoded = await request.jwtVerify<{ id: number }>();
        const response = await authService.getMe(fastify, decoded.id);
        reply.send(response);
    } catch (err) {
        reply.code(401).send({ success: false, message: 'Unauthorized' });
    }
};
