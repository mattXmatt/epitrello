import { FastifySchema } from 'fastify';

const assigneeDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        userId: { type: 'number' },
        cardId: { type: 'number' },
        cardType: { type: 'string', enum: ['event', 'task'] },
    },
};

const assigneeResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: assigneeDTO,
    },
};

const assigneesResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: assigneeDTO,
        },
    },
};

export const createAssigneeSchema: FastifySchema = {
    description: 'Create a new assignee',
    tags: ['assignees'],
    body: {
        type: 'object',
        required: ['userId', 'cardId', 'cardType'],
        properties: {
            userId: { type: 'number' },
            cardId: { type: 'number' },
            cardType: { type: 'string', enum: ['event', 'task'] },
        },
    },
    response: {
        201: assigneeResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getAssigneesSchema: FastifySchema = {
    description: 'Get all assignees for a card',
    tags: ['assignees'],
    querystring: {
        type: 'object',
        required: ['cardId', 'cardType'],
        properties: {
            cardId: { type: 'number' },
            cardType: { type: 'string', enum: ['event', 'task'] },
        },
    },
    response: {
        200: assigneesResponse,
    },
};

export const deleteAssigneeSchema: FastifySchema = {
    description: 'Delete an assignee by ID',
    tags: ['assignees'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                message: { type: 'string' },
            },
        },
    },
};