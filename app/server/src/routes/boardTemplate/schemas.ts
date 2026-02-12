import { FastifySchema } from 'fastify';

const boardTemplateDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        createdBy: { type: 'number' },
        templateName: { type: 'string' },
        description: { type: 'string' },
        templateData: { type: 'object', additionalProperties: true },
    },
};

const boardTemplateResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: boardTemplateDTO,
    },
};

const boardTemplatesResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: boardTemplateDTO,
        },
    },
};

export const createBoardTemplateSchema: FastifySchema = {
    description: 'Create a new board template',
    tags: ['board-templates'],
    body: {
        type: 'object',
        required: ['createdBy', 'templateName', 'templateData'],
        properties: {
            createdBy: { type: 'number' },
            templateName: { type: 'string' },
            description: { type: 'string' },
            templateData: { type: 'object', additionalProperties: true },
        },
    },
    response: {
        201: boardTemplateResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getBoardTemplatesSchema: FastifySchema = {
    description: 'Get all board templates',
    tags: ['board-templates'],
    response: {
        200: boardTemplatesResponse,
    },
};

export const getBoardTemplateByIdSchema: FastifySchema = {
    description: 'Get a board template by ID',
    tags: ['board-templates'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: boardTemplateResponse,
    },
};

export const updateBoardTemplateSchema: FastifySchema = {
    description: 'Update a board template by ID',
    tags: ['board-templates'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    body: {
        type: 'object',
        properties: {
            templateName: { type: 'string' },
            description: { type: 'string' },
            templateData: { type: 'object', additionalProperties: true },
        },
    },
    response: {
        200: boardTemplateResponse,
    },
};

export const deleteBoardTemplateSchema: FastifySchema = {
    description: 'Delete a board template by ID',
    tags: ['board-templates'],
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