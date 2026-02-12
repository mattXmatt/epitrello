import { createDocumentationDTO, updateDocumentationDTO, documentationResponseDTO } from "./interfaces.js";

export const documentationService = {
    async createDocumentation(fastify: any, data: createDocumentationDTO): Promise<documentationResponseDTO> {
        try {
            const newDocumentation = await fastify.pg.query(
                'INSERT INTO "Documentation" ("boardId", "documentName", "content", "createdBy") VALUES ($1, $2, $3, $4) RETURNING *',
                [data.boardId, data.documentName, data.content, data.createdBy]
            );
            return { success: true, result: newDocumentation };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getDocumentations(fastify: any): Promise<documentationResponseDTO> {
        try {
            const documentations = await fastify.pg.query(
                'SELECT * FROM "Documentation"'
            );
            return { success: true, result: documentations };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getDocumentationById(fastify: any, id: number): Promise<documentationResponseDTO> {
        try {
            const documentation = await fastify.pg.query(
                'SELECT * FROM "Documentation" WHERE id = $1',
                [id]
            );
            return { success: true, result: documentation };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateDocumentation(fastify: any, id: number, data: updateDocumentationDTO): Promise<documentationResponseDTO> {
        try {
            const documentation = await fastify.pg.query(
                'UPDATE "Documentation" SET "documentName" = $1, "content" = $2, "updatedBy" = $3, "updatedAt" = NOW() WHERE id = $4 RETURNING *',
                [data.documentName, data.content, data.updatedBy, id]
            );
            return { success: true, result: documentation };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteDocumentation(fastify: any, id: number): Promise<documentationResponseDTO> {
        try {
            const documentation = await fastify.pg.query(
                'DELETE FROM "Documentation" WHERE id = $1',
                [id]
            );
            return { success: true, result: documentation };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}