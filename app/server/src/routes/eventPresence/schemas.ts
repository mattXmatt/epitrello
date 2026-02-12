import { FastifySchema } from 'fastify';

const eventPresenceDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        eventId: { type: 'number' },
        userId: { type: 'number' },
        status: { type: 'string' },
    },
};

const eventPresenceResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: eventPresenceDTO,
    },
};

const eventPresencesResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: eventPresenceDTO,
        },
    },
};

export const createEventPresenceSchema: FastifySchema = {
    description: 'Create a new event presence',
    tags: ['event-presences'],
    body: {
        type: 'object',
        required: ['eventId', 'userId', 'status'],
        properties: {
            eventId: { type: 'number' },
            userId: { type: 'number' },
            status: { type: 'string' },
        },
    },
    response: {
        201: eventPresenceResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getEventPresencesSchema: FastifySchema = {
    description: 'Get all event presences for an event',
    tags: ['event-presences'],
    querystring: {
        type: 'object',
        required: ['eventId'],
        properties: {
            eventId: { type: 'number' },
        },
    },
    response: {
        200: eventPresencesResponse,
    },
};

export const getEventPresenceByIdSchema: FastifySchema = {
    description: 'Get an event presence by ID',
    tags: ['event-presences'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: eventPresenceResponse,
    },
};

export const updateEventPresenceSchema: FastifySchema = {
    description: 'Update an event presence by ID',
    tags: ['event-presences'],
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
            status: { type: 'string' },
        },
    },
    response: {
        200: eventPresenceResponse,
    },
};

export const deleteEventPresenceSchema: FastifySchema = {
    description: 'Delete an event presence by ID',
    tags: ['event-presences'],
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