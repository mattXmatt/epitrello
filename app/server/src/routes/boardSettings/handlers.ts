import { FastifyReply, FastifyRequest } from 'fastify';
import { boardSettingsService } from './service.js';
import { updateBoardSettingsDTO } from './interfaces.js';

export const getBoardSettingsByBoardIdHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.params as { boardId: number };
    const response = await boardSettingsService.getBoardSettingsByBoardId(fastify, boardId);
    reply.send(response);
};

export const updateBoardSettingsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
    const fastify = request.server;
    const { boardId } = request.params as { boardId: number };
    const boardSettingsData = request.body as updateBoardSettingsDTO;
    const response = await boardSettingsService.updateBoardSettings(fastify, boardId, boardSettingsData);

    if (response.success) {
        reply.code(200).send(response);
    } else {
        reply.code(400).send(response);
    }
};