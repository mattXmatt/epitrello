import { FastifySchema } from 'fastify';

const tagDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        boardId: { type: 'number' },
        name: { type: 'string' },
        color: { type: 'string' },
    },
};

const tagResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: tagDTO,
    },
};

const tagsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: tagDTO,
        },
    },
};

export const createTagSchema: FastifySchema = {
    description: 'Create a new tag',
    tags: ['tags'],
    body: {
        type: 'object',
        required: ['boardId', 'name', 'color'],
        properties: {
            boardId: { type: 'number' },
            name: { type: 'string' },
            color: { type: 'string' },
        },
    },
    response: {
        201: tagResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getTagsSchema: FastifySchema = {
    description: 'Get all tags for a board',
    tags: ['tags'],
    querystring: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    response: {
        200: tagsResponse,
    },
};

export const getTagByIdSchema: FastifySchema = {
    description: 'Get a tag by ID',
    tags: ['tags'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: tagResponse,
    },
};

export const updateTagSchema: FastifySchema = {
    description: 'Update a tag by ID',
    tags: ['tags'],
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
            name: { type: 'string' },
            color: { type: 'string' },
        },
    },
    response: {
        200: tagResponse,
    },
};

export const deleteTagSchema: FastifySchema = {
    description: 'Delete a tag by ID',
    tags: ['tags'],
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