import { createTagDTO, updateTagDTO, tagResponseDTO } from "./interfaces.js";

export const tagService = {
    async createTag(fastify: any, data: createTagDTO): Promise<tagResponseDTO> {
        try {
            const newTag = await fastify.pg.query(
                'INSERT INTO "tags" ("boardId", "name", "color") VALUES ($1, $2, $3) RETURNING *',
                [data.boardId, data.name, data.color]
            );
            return { success: true, result: newTag.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getTags(fastify: any, boardId: number): Promise<tagResponseDTO> {
        try {
            const tags = await fastify.pg.query(
                'SELECT * FROM "tags" WHERE "boardId" = $1',
                [boardId]
            );
            return { success: true, result: tags.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getTagById(fastify: any, id: number): Promise<tagResponseDTO> {
        try {
            const tag = await fastify.pg.query(
                'SELECT * FROM "tags" WHERE id = $1',
                [id]
            );
            return { success: true, result: tag.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateTag(fastify: any, id: number, data: updateTagDTO): Promise<tagResponseDTO> {
        try {
            const tag = await fastify.pg.query(
                'UPDATE "tags" SET "name" = $1, "color" = $2 WHERE id = $3 RETURNING *',
                [data.name, data.color, id]
            );
            return { success: true, result: tag.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteTag(fastify: any, id: number): Promise<tagResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "tags" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'Tag deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}