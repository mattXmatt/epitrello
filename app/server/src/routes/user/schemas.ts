import { FastifySchema } from 'fastify';

const userDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        name: { type: 'string' },
        surname: { type: 'string' },
        email: { type: 'string', format: 'email' },
    },
};

const userResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: userDTO,
    },
};

const usersResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: userDTO,
        },
    },
};

export const createUserSchema: FastifySchema = {
    description: 'Create a new user',
    tags: ['users', 'create'],
    body: {
        type: 'object',
        required: ['surname'],
        properties: {
            name: { type: 'string' },
            surname: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
        },
    },
    response: {
        201: userResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getUsersSchema: FastifySchema = {
    description: 'Get all users',
    tags: ['users', 'get'],
    response: {
        200: usersResponse,
    },
};

export const getUserByIdSchema: FastifySchema = {
    description: 'Get a user by ID',
    tags: ['users', 'get'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: userResponse,
        400: {
            type:'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            }
        }
    },
};

export const updateUserSchema: FastifySchema = {
    description: 'Update a user by ID',
    tags: ['users', 'update'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
            name: { type: 'string' },
            surname: { type: 'string' },
            email: { type: 'string', format: 'email' },
            password: { type: 'string' },
            },
    },
    response: {
        200: userResponse,
        400: {
            type:'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        }
    }
};

export const deleteUserSchema: FastifySchema = {
    description: 'Delete a user by ID',
    tags: ['users', 'delete'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: userResponse,
        400: {
            type: 'object',
            properties: {
                success: {type: 'boolean', default: false},
                message: {type: 'string'}
            }
        },
    }
};