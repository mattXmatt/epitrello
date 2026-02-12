import { FastifyInstance } from 'fastify';
import {
    createBoardHandler,
    getBoardsHandler,
    getBoardByIdHandler,
    deleteBoardHandler,
    updateBoardSettingsHandler
} from './handlers.js';

export default async function (fastify: FastifyInstance) {
    fastify.post('/', { onRequest: [fastify.authenticate] }, createBoardHandler);
    fastify.get('/', { onRequest: [fastify.authenticate] }, getBoardsHandler);
    fastify.get('/:id', { onRequest: [fastify.authenticate] }, getBoardByIdHandler);
    fastify.put('/:id/settings', { onRequest: [fastify.authenticate] }, updateBoardSettingsHandler);
    fastify.delete('/:id', { onRequest: [fastify.authenticate] }, deleteBoardHandler);
}