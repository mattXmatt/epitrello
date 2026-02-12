import { createBoardTemplateDTO, updateBoardTemplateDTO, boardTemplateResponseDTO } from "./interfaces.js";

export const boardTemplateService = {
    async createBoardTemplate(fastify: any, data: createBoardTemplateDTO): Promise<boardTemplateResponseDTO> {
        try {
            const newBoardTemplate = await fastify.pg.query(
                'INSERT INTO "BoardTemplate" ("createdBy", "templateName", "description", "templateData") VALUES ($1, $2, $3, $4) RETURNING *',
                [data.createdBy, data.templateName, data.description, data.templateData]
            );
            return { success: true, result: newBoardTemplate.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardTemplates(fastify: any): Promise<boardTemplateResponseDTO> {
        try {
            const boardTemplates = await fastify.pg.query(
                'SELECT * FROM "BoardTemplate"'
            );
            return { success: true, result: boardTemplates.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardTemplateById(fastify: any, id: number): Promise<boardTemplateResponseDTO> {
        try {
            const boardTemplate = await fastify.pg.query(
                'SELECT * FROM "BoardTemplate" WHERE id = $1',
                [id]
            );
            return { success: true, result: boardTemplate.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardTemplate(fastify: any, id: number, data: updateBoardTemplateDTO): Promise<boardTemplateResponseDTO> {
        try {
            const boardTemplate = await fastify.pg.query(
                'UPDATE "BoardTemplate" SET "templateName" = $1, "description" = $2, "templateData" = $3 WHERE id = $4 RETURNING *',
                [data.templateName, data.description, data.templateData, id]
            );
            return { success: true, result: boardTemplate.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteBoardTemplate(fastify: any, id: number): Promise<boardTemplateResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "BoardTemplate" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'BoardTemplate deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}