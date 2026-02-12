import { FastifySchema } from 'fastify';

const taskSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        taskName: { type: 'string' },
        taskIndex: { type: 'number' },
        boardColumnId: { type: 'number' },
        description: { type: ['string', 'null'] },
        startingDate: { type: 'string', format: 'date-time' },
        endingDate: { type: ['string', 'null'], format: 'date-time' },
        duration: { type: ['number', 'null'] },
        integrations: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: ['string', 'null'], format: 'date-time' },
        createdBy: { type: 'number' },
        updatedBy: { type: ['number', 'null'] },
        priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'None'] },
        comment: { type: ['object', 'null'], additionalProperties: true },
        stepsChecklist: { type: ['object', 'null'], additionalProperties: true }
    }
};

const eventSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        eventName: { type: 'string' },
        eventIndex: { type: 'number' },
        boardColumnId: { type: 'number' },
        description: { type: ['string', 'null'] },
        startingDate: { type: 'string', format: 'date-time' },
        endingDate: { type: ['string', 'null'], format: 'date-time' },
        duration: { type: ['string', 'null'] },
        integration: { type: ['string', 'null'] },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: ['string', 'null'], format: 'date-time' },
        createdBy: { type: 'number' },
        updatedBy: { type: ['number', 'null'] },
        type: { type: 'string', enum: ['meeting', 'event'] },
        resume: { type: ['string', 'null'] },
        location: { type: ['string', 'null'] }
    }
};

const columnSchema = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        columnName: { type: 'string' },
        description: { type: ['string', 'null'] },
        boardId: { type: 'number' },
        columnIndex: { type: 'number' },
        tasks: { type: 'array', items: taskSchema },
        events: { type: 'array', items: eventSchema }
    }
};

const boardDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        boardName: { type: 'string' },
        description: { type: ['string', 'null'] },
        boardSettingsId: { type: 'number' },
        documentationSectionId: { type: 'number' },
        createdBy: { type: 'number' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: ['string', 'null'], format: 'date-time' },
    },
};

const boardResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        result: boardDTO,
    },
};

const boardDetailDTO = {
    type: 'object',
    properties: {
        ...boardDTO.properties,
        columns: {
            type: 'array',
            items: columnSchema,
        },
    },
};

const boardsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        result: {
            type: 'array',
            items: boardDTO,
        },
    },
};

export const createBoardSchema: FastifySchema = {
    description: 'Create a new board',
    tags: ['boards'],
    body: {
        type: 'object',
        required: ['boardName'],
        properties: {
            boardName: { type: 'string' },
            description: { type: 'string' },
        },
    },
    response: {
        201: boardResponse,
    },
};

export const getBoardsSchema: FastifySchema = {
    description: 'Get all boards for the user',
    tags: ['boards'],
    response: {
        200: boardsResponse,
    },
};

export const getBoardByIdSchema: FastifySchema = {
    description: 'Get a single board by its ID',
    tags: ['boards'],
    params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number' } },
    },
    response: {
        200: {
            type: 'object',
            properties: {
                success: { type: 'boolean' },
                result: boardDetailDTO,
            },
        },
    },
};

export const updateBoardSchema: FastifySchema = {
    description: 'Update a board',
    tags: ['boards'],
    params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number' } },
    },
    body: {
        type: 'object',
        properties: {
            boardName: { type: 'string' },
            description: { type: 'string' },
        },
    },
    response: {
        200: boardResponse,
    },
};

export const deleteBoardSchema: FastifySchema = {
    description: 'Delete a board',
    tags: ['boards'],
    params: {
        type: 'object',
        required: ['id'],
        properties: { id: { type: 'number' } },
    },
};