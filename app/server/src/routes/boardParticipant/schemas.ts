import { FastifySchema } from 'fastify';

const boardParticipantDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        boardId: { type: 'number' },
        participantUserId: { type: 'number' },
        role: { type: 'string', enum: ['admin', 'member', 'guest'] },
    },
};

const boardParticipantResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: boardParticipantDTO,
    },
};

const boardParticipantsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: boardParticipantDTO,
        },
    },
};

export const createBoardParticipantSchema: FastifySchema = {
    description: 'Create a new board participant',
    tags: ['board-participants'],
    body: {
        type: 'object',
        required: ['boardId', 'participantUserId', 'role'],
        properties: {
            boardId: { type: 'number' },
            participantUserId: { type: 'number' },
            role: { type: 'string', enum: ['admin', 'member', 'guest'] },
        },
    },
    response: {
        201: boardParticipantResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getBoardParticipantsSchema: FastifySchema = {
    description: 'Get all board participants for a board',
    tags: ['board-participants'],
    querystring: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    response: {
        200: boardParticipantsResponse,
    },
};

export const getBoardParticipantByIdSchema: FastifySchema = {
    description: 'Get a board participant by ID',
    tags: ['board-participants'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: boardParticipantResponse,
    },
};

export const updateBoardParticipantSchema: FastifySchema = {
    description: 'Update a board participant by ID',
    tags: ['board-participants'],
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
            role: { type: 'string', enum: ['admin', 'member', 'guest'] },
        },
    },
    response: {
        200: boardParticipantResponse,
    },
};

export const deleteBoardParticipantSchema: FastifySchema = {
    description: 'Delete a board participant by ID',
    tags: ['board-participants'],
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