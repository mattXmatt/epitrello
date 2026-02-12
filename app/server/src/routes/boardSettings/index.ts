import { FastifyInstance, FastifyPluginOptions } from 'fastify';
import {
    getBoardSettingsByBoardIdHandler,
    updateBoardSettingsHandler,
} from './handlers.js';
import {
    getBoardSettingsByBoardIdSchema,
    updateBoardSettingsSchema,
} from './schemas.js';

export default async function (
    fastify: FastifyInstance,
    options: FastifyPluginOptions
) {
    fastify.get('/:boardId', { schema: getBoardSettingsByBoardIdSchema }, getBoardSettingsByBoardIdHandler);

    fastify.put('/:boardId', { schema: updateBoardSettingsSchema }, updateBoardSettingsHandler);
}