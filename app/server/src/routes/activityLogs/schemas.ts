import { FastifySchema } from 'fastify';

const activityLogDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        logName: { type: 'string' },
        userId: { type: 'number' },
        boardId: { type: 'number' },
        entityType: { type: 'string', enum: ['task', 'board', 'documentation', 'board_column', 'board_settings', 'user'] },
        entityId: { type: 'number' },
        action: { type: 'string', enum: ['create', 'delete', 'update', 'assign_user', 'add_user'] },
        detail: { type: 'object', additionalProperties: true },
        createdAt: { type: 'string', format: 'date-time' },
    },
};

const activityLogResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: activityLogDTO,
    },
};

const activityLogsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: activityLogDTO,
        },
    },
};

export const createActivityLogSchema: FastifySchema = {
    description: 'Create a new activity log',
    tags: ['activity-logs'],
    body: {
        type: 'object',
        required: ['logName', 'userId', 'boardId', 'entityType', 'entityId', 'action'],
        properties: {
            logName: { type: 'string' },
            userId: { type: 'number' },
            boardId: { type: 'number' },
            entityType: { type: 'string', enum: ['task', 'board', 'documentation', 'board_column', 'board_settings', 'user'] },
            entityId: { type: 'number' },
            action: { type: 'string', enum: ['create', 'delete', 'update', 'assign_user', 'add_user'] },
            detail: { type: 'object', additionalProperties: true },
        },
    },
    response: {
        201: activityLogResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getActivityLogsSchema: FastifySchema = {
    description: 'Get all activity logs for a board',
    tags: ['activity-logs'],
    querystring: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    response: {
        200: activityLogsResponse,
    },
};