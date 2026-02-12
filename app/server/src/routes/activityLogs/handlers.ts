import { FastifyReply, FastifyRequest } from 'fastify';
import { activityLogService } from './service.js';
import { createActivityLogDTO } from './interfaces.js';

export const createActivityLogHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const activityLogData = request.body as createActivityLogDTO;
    const response = await activityLogService.createActivityLog(fastify, activityLogData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getActivityLogsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.query as { boardId: number };
    const response = await activityLogService.getActivityLogs(fastify, boardId);
    reply.send(response);
};