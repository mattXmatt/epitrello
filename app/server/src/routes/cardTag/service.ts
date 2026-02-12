import { createCardTagDTO, cardTagResponseDTO } from "./interfaces.js";

export const cardTagService = {
    async createCardTag(fastify: any, data: createCardTagDTO): Promise<cardTagResponseDTO> {
        try {
            const newCardTag = await fastify.pg.query(
                'INSERT INTO "cardTag" ("cardId", "tagId", "cardType") VALUES ($1, $2, $3) RETURNING *',
                [data.cardId, data.tagId, data.cardType]
            );
            return { success: true, result: newCardTag.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getCardTags(fastify: any, cardId: number, cardType: string): Promise<cardTagResponseDTO> {
        try {
            const cardTags = await fastify.pg.query(
                'SELECT * FROM "cardTag" WHERE "cardId" = $1 AND "cardType" = $2',
                [cardId, cardType]
            );
            return { success: true, result: cardTags.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteCardTag(fastify: any, id: number): Promise<cardTagResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "cardTag" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'CardTag deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}