import { FastifySchema } from 'fastify';

const taskDTO = {
    type: 'object',
    properties: {
        id: { type: 'number' },
        taskName: { type: 'string' },
        taskIndex: { type: 'number' },
        boardColumnId: { type: 'number' },
        description: { type: 'string' },
        startingDate: { type: 'string', format: 'date-time' },
        endingDate: { type: 'string', format: 'date-time' },
        duration: { type: 'number' },
        integrations: { type: 'string' },
        createdBy: { type: 'number' },
        updatedBy: { type: 'number' },
        priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'None'] },
        comment: { type: 'object', additionalProperties: true },
        stepsChecklist: { type: 'object', additionalProperties: true },
    },
};

const taskResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: taskDTO,
    },
};

const tasksResponse = {
    type: 'object',
    properties: {
        success: { type: 'boolean' },
        message: { type: 'string' },
        result: {
            type: 'array',
            items: taskDTO,
        },
    },
};

export const createTaskSchema: FastifySchema = {
    description: 'Create a new task',
    tags: ['tasks'],
    body: {
        type: 'object',
        required: ['taskName', 'taskIndex', 'boardColumnId', 'startingDate', 'createdBy', 'priority'],
        properties: {
            taskName: { type: 'string' },
            taskIndex: { type: 'number' },
            boardColumnId: { type: 'number' },
            description: { type: 'string' },
            startingDate: { type: 'string', format: 'date-time' },
            endingDate: { type: 'string', format: 'date-time' },
            duration: { type: 'number' },
            integrations: { type: 'string' },
            createdBy: { type: 'number' },
            priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'None'] },
            comment: { type: 'object', additionalProperties: true },
            stepsChecklist: { type: 'object', additionalProperties: true },
        },
    },
    response: {
        201: taskResponse,
        400: {
            type: 'object',
            properties: {
                success: { type: 'boolean', default: false },
                message: { type: 'string' },
            },
        },
    },
};

export const getTasksSchema: FastifySchema = {
    description: 'Get all tasks for a board column',
    tags: ['tasks'],
    querystring: {
        type: 'object',
        required: ['boardColumnId'],
        properties: {
            boardColumnId: { type: 'number' },
        },
    },
    response: {
        200: tasksResponse,
    },
};

export const getTaskByIdSchema: FastifySchema = {
    description: 'Get a task by ID',
    tags: ['tasks'],
    params: {
        type: 'object',
        required: ['id'],
        properties: {
            id: { type: 'number' },
        },
    },
    response: {
        200: taskResponse,
    },
};

export const updateTaskSchema: FastifySchema = {
    description: 'Update a task by ID',
    tags: ['tasks'],
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
            taskName: { type: 'string' },
            taskIndex: { type: 'number' },
            boardColumnId: { type: 'number' },
            description: { type: 'string' },
            startingDate: { type: 'string', format: 'date-time' },
            endingDate: { type: 'string', format: 'date-time' },
            duration: { type: 'number' },
            integrations: { type: 'string' },
            updatedBy: { type: 'number' },
            priority: { type: 'string', enum: ['P0', 'P1', 'P2', 'None'] },
            comment: { type: 'object', additionalProperties: true },
            stepsChecklist: { type: 'object', additionalProperties: true },
        },
    },
    response: {
        200: taskResponse,
    },
};

export const deleteTaskSchema: FastifySchema = {
    description: 'Delete a task by ID',
    tags: ['tasks'],
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