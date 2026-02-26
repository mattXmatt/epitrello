import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    inviteUserHandler,
    getParticipantsHandler,
    removeParticipantHandler,
    updateParticipantRoleHandler,
} from './handlers.js';

export default async function (fastify: FastifyInstance, options: FastifyPluginOptions) {
    fastify.post('/invite',           { onRequest: [fastify.authenticate] }, inviteUserHandler);
    fastify.get('/:boardId',          { onRequest: [fastify.authenticate] }, getParticipantsHandler);
    fastify.delete('/:participantId', { onRequest: [fastify.authenticate] }, removeParticipantHandler);
    fastify.put('/:participantId',    { onRequest: [fastify.authenticate] }, updateParticipantRoleHandler);
}
