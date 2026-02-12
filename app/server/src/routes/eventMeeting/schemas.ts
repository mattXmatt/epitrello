import { FastifySchema } from 'fastify';

const eventMeetingDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        eventName: { type: 'string' },
        eventIndex: { type: 'number' },
        boardColumnId: { type: 'number' },
        description: { type: 'string' },
        startingDate: { type: 'string', format: 'date-time' },
        endingDate: { type: 'string', format: 'date-time' },
        duration: { type: 'string' },
        integration: { type: 'string' },
        createdBy: { type: 'number' },
        updatedBy: { type: 'number' },
        type: { type: 'string', enum: ['meeting', 'event'] },
        resume: { type: 'string' },
        location: { type: 'string' },
    },
};

const eventMeetingResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: eventMeetingDTO,
    },
};

const eventMeetingsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: eventMeetingDTO,
        },
    },
};

export const createEventMeetingSchema: FastifySchema = {
    description: 'Create a new event or meeting',
    tags: ['event-meetings'],
    body: {
        type: 'object',
        required: ['eventName', 'boardColumnId', 'startingDate', 'type'],
        properties: {
            eventName: { type: 'string' },
            eventIndex: { type: 'number' },
            boardColumnId: { type: 'number' },
            description: { type: 'string' },
            startingDate: { type: 'string', format: 'date-time' },
            endingDate: { type: 'string', format: 'date-time' },
            duration: { type: 'string' },
            integration: { type: 'string' },
            createdBy: { type: 'number' },
            type: { type: 'string', enum: ['meeting', 'event'] },
            resume: { type: 'string' },
            location: { type: 'string' },
        },
    },
    response: {
        201: eventMeetingResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getEventMeetingsSchema: FastifySchema = {
    description: 'Get all events and meetings for a board column',
    tags: ['event-meetings'],
    querystring: {
        type: 'object',
        required: ['boardColumnId'],
        properties: {
            boardColumnId: { type: 'number' },
        },
    },
    response: {
        200: eventMeetingsResponse,
    },
};

export const getEventMeetingByIdSchema: FastifySchema = {
    description: 'Get an event or meeting by ID',
    tags: ['event-meetings'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: eventMeetingResponse,
    },
};

export const updateEventMeetingSchema: FastifySchema = {
    description: 'Update an event or meeting by ID',
    tags: ['event-meetings'],
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
            eventName: { type: 'string' },
            eventIndex: { type: 'number' },
            boardColumnId: { type: 'number' },
            description: { type: 'string' },
            startingDate: { type: 'string', format: 'date-time' },
            endingDate: { type: 'string', format: 'date-time' },
            duration: { type: 'string' },
            integration: { type: 'string' },
            updatedBy: { type: 'number' },
            type: { type: 'string', enum: ['meeting', 'event'] },
            resume: { type: 'string' },
            location: { type: 'string' },
        },
    },
    response: {
        200: eventMeetingResponse,
    },
};

export const deleteEventMeetingSchema: FastifySchema = {
    description: 'Delete an event or meeting by ID',
    tags: ['event-meetings'],
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