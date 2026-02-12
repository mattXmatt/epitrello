import { FastifySchema } from 'fastify';

const boardColumnDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        columnName: { type: 'string' },
        description: { type: 'string' },
        boardId: { type: 'number' },
        columnIndex: { type: 'number' },
    },
};

const boardColumnResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: boardColumnDTO,
    },
};

const boardColumnsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: boardColumnDTO,
        },
    },
};

export const createBoardColumnSchema: FastifySchema = {
    description: 'Create a new board column',
    tags: ['board-columns'],
    body: {
        type: 'object',
        required: ['columnName', 'boardId', 'columnIndex'],
        properties: {
            columnName: { type: 'string' },
            description: { type: 'string' },
            boardId: { type: 'number' },
            columnIndex: { type: 'number' },
        },
    },
    response: {
        201: boardColumnResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getBoardColumnsSchema: FastifySchema = {
    description: 'Get all board columns for a board',
    tags: ['board-columns'],
    querystring: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    response: {
        200: boardColumnsResponse,
    },
};

export const getBoardColumnByIdSchema: FastifySchema = {
    description: 'Get a board column by ID',
    tags: ['board-columns'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: boardColumnResponse,
    },
};

export const updateBoardColumnSchema: FastifySchema = {
    description: 'Update a board column by ID',
    tags: ['board-columns'],
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
            columnName: { type: 'string' },
            description: { type: 'string' },
            columnIndex: { type: 'number' },
        },
    },
    response: {
        200: boardColumnResponse,
    },
};

export const deleteBoardColumnSchema: FastifySchema = {
    description: 'Delete a board column by ID',
    tags: ['board-columns'],
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