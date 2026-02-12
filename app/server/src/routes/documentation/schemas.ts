import { FastifySchema } from 'fastify';

const documentationDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        boardId: { type: 'number' },
        documentName: { type: 'string' },
        content: { type: 'string' },
        createdAt: { type: 'string', format: 'date-time' },
        updatedAt: { type: 'string', format: 'date-time' },
        createdBy: { type: 'number' },
        updatedBy: { type: 'number' }
    },
};

const documentationResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: documentationDTO,
    },
};

const documentationsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: documentationDTO,
        },
    },
};

export const createDocumentationSchema: FastifySchema = {
    description: 'Create a new document',
    tags: ['documentation', 'create'],
    body: {
        type: 'object',
        required: ['boardId', 'documentName', 'createdBy'],
        properties: {
            boardId: { type: 'number' },
            documentName: { type: 'string' },
            content: { type: 'string' },
            createdBy: { type: 'number' }
        },
    },
    response: {
        201: documentationResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getDocumentationsSchema: FastifySchema = {
    description: 'Get all documents',
    tags: ['documentation', 'get'],
    response: {
        200: documentationsResponse,
    },
};

export const getDocumentationByIdSchema: FastifySchema = {
    description: 'Get a document by ID',
    tags: ['documentation', 'get'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: documentationResponse,
        400: {
            type:'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            }
        }
    },
};

export const updateDocumentationSchema: FastifySchema = {
    description: 'Update a document by ID',
    tags: ['documentation', 'update'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    body: {
        type: 'object',
        required: ['updatedBy'],
        properties: {
            documentName: { type: 'string' },
            content: { type: 'string' },
            updatedBy: { type: 'number' }
        },
    },
    response: {
        200: documentationResponse,
        400: {
            type:'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        }
    }
};

export const deleteDocumentationSchema: FastifySchema = {
    description: 'Delete a document by ID',
    tags: ['documentation', 'delete'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: documentationResponse,
        400: {
            type: 'object',
            properties: {
                success: {type: 'boolean', default: false},
                message: {type: 'string'}
            }
        },
    }
};
