import { FastifySchema } from 'fastify';

const userConnectionDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        userId: { type: 'number' },
        provider: { type: 'string' },
        providerAccountId: { type: 'string' },
        accessToken: { type: 'string' },
        refreshToken: { type: 'string' },
        expiresAt: { type: 'string', format: 'date-time' },
        scope: { type: 'string' },
        tokenType: { type: 'string' },
    },
};

const userConnectionResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: userConnectionDTO,
    },
};

const userConnectionsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: userConnectionDTO,
        },
    },
};

export const createUserConnectionSchema: FastifySchema = {
    description: 'Create a new user connection',
    tags: ['user-connections'],
    body: {
        type: 'object',
        required: ['userId', 'provider', 'providerAccountId'],
        properties: {
            userId: { type: 'number' },
            provider: { type: 'string' },
            providerAccountId: { type: 'string' },
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            scope: { type: 'string' },
            tokenType: { type: 'string' },
        },
    },
    response: {
        201: userConnectionResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getUserConnectionsSchema: FastifySchema = {
    description: 'Get all user connections',
    tags: ['user-connections'],
    response: {
        200: userConnectionsResponse,
    },
};

export const getUserConnectionByIdSchema: FastifySchema = {
    description: 'Get a user connection by ID',
    tags: ['user-connections'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: userConnectionResponse,
    },
};

export const updateUserConnectionSchema: FastifySchema = {
    description: 'Update a user connection by ID',
    tags: ['user-connections'],
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
            accessToken: { type: 'string' },
            refreshToken: { type: 'string' },
            expiresAt: { type: 'string', format: 'date-time' },
            scope: { type: 'string' },
            tokenType: { type: 'string' },
        },
    },
    response: {
        200: userConnectionResponse,
    },
};

export const deleteUserConnectionSchema: FastifySchema = {
    description: 'Delete a user connection by ID',
    tags: ['user-connections'],
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