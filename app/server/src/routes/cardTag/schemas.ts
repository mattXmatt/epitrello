import { FastifySchema } from 'fastify';

const cardTagDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        cardId: { type: 'number' },
        tagId: { type: 'number' },
        cardType: { type: 'string', enum: ['event', 'task'] },
    },
};

const cardTagResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: cardTagDTO,
    },
};

const cardTagsResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: cardTagDTO,
        },
    },
};

export const createCardTagSchema: FastifySchema = {
    description: 'Create a new card tag',
    tags: ['card-tags'],
    body: {
        type: 'object',
        required: ['cardId', 'tagId', 'cardType'],
        properties: {
            cardId: { type: 'number' },
            tagId: { type: 'number' },
            cardType: { type: 'string', enum: ['event', 'task'] },
        },
    },
    response: {
        201: cardTagResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getCardTagsSchema: FastifySchema = {
    description: 'Get all tags for a card',
    tags: ['card-tags'],
    querystring: {
        type: 'object',
        required: ['cardId', 'cardType'],
        properties: {
            cardId: { type: 'number' },
            cardType: { type: 'string', enum: ['event', 'task'] },
        },
    },
    response: {
        200: cardTagsResponse,
    },
};

export const deleteCardTagSchema: FastifySchema = {
    description: 'Delete a card tag by ID',
    tags: ['card-tags'],
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