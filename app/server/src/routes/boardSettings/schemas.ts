import { FastifySchema } from 'fastify';

const boardSettingsDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        boardId: { type: 'number' },
        backgroundColor: { type: 'string' },
    },
};

const boardSettingsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: boardSettingsDTO,
    },
};

export const getBoardSettingsByBoardIdSchema: FastifySchema = {
    description: 'Get board settings by board ID',
    tags: ['board-settings'],
    params: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    response: {
        200: boardSettingsResponse,
    },
};

export const updateBoardSettingsSchema: FastifySchema = {
    description: 'Update board settings by board ID',
    tags: ['board-settings'],
    params: {
        type: 'object',
        required: ['boardId'],
        properties: {
            boardId: { type: 'number' },
        },
    },
    body: {
        type: 'object',
        properties: {
            backgroundColor: { type: 'string' },
        },
    },
    response: {
        200: boardSettingsResponse,
    },
};