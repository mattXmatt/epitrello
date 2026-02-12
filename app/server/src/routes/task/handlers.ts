import { FastifyReply, FastifyRequest } from 'fastify';
import { taskService } from './service.js';
import { createTaskDTO, updateTaskDTO } from './interfaces.js';

export const createTaskHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const taskData = request.body as createTaskDTO;
    
    const response = await taskService.createTask(fastify, taskData);

    if (response.success) {
        reply.code(201).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const getTasksHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardColumnId } = request.query as { boardColumnId: number };
    const response = await taskService.getTasks(fastify, boardColumnId);
    reply.send(response);
};

export const getTaskByIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await taskService.getTaskById(fastify, id);
    reply.send(response);
};

export const updateTaskHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const taskData = request.body as updateTaskDTO;
    const response = await taskService.updateTask(fastify, id, taskData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};

export const deleteTaskHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { id } = request.params as { id: number };
    const response = await taskService.deleteTask(fastify, id);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};