import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    createBoardParticipantHandler,
    getBoardParticipantsHandler,
    getBoardParticipantByIdHandler,
    updateBoardParticipantHandler,
    deleteBoardParticipantHandler,
} from './handlers.js';
import {
    createBoardParticipantSchema,
    getBoardParticipantsSchema,
    getBoardParticipantByIdSchema,
    updateBoardParticipantSchema,
    deleteBoardParticipantSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.post('/', { schema: createBoardParticipantSchema }, createBoardParticipantHandler);

    fastify.get('/', { schema: getBoardParticipantsSchema }, getBoardParticipantsHandler);

    fastify.get('/:id', { schema: getBoardParticipantByIdSchema }, getBoardParticipantByIdHandler);

    fastify.put('/:id', { schema: updateBoardParticipantSchema }, updateBoardParticipantHandler);

    fastify.delete('/:id', { schema: deleteBoardParticipantSchema }, deleteBoardParticipantHandler);
}