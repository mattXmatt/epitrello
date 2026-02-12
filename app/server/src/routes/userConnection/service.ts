import { createUserConnectionDTO, updateUserConnectionDTO, userConnectionResponseDTO } from "./interfaces.js";

export const userConnectionService = {
    async createUserConnection(fastify: any, data: createUserConnectionDTO): Promise<userConnectionResponseDTO> {
        try {
            const newUserConnection = await fastify.pg.query(
                'INSERT INTO "UserConnection" ("userId", "provider", "providerAccountId", "accessToken", "refreshToken", "expiresAt", "scope", "tokenType") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [data.userId, data.provider, data.providerAccountId, data.accessToken, data.refreshToken, data.expiresAt, data.scope, data.tokenType]
            );
            return { success: true, result: newUserConnection.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getUserConnections(fastify: any): Promise<userConnectionResponseDTO> {
        try {
            const userConnections = await fastify.pg.query(
                'SELECT * FROM "UserConnection"'
            );
            return { success: true, result: userConnections.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getUserConnectionById(fastify: any, id: number): Promise<userConnectionResponseDTO> {
        try {
            const userConnection = await fastify.pg.query(
                'SELECT * FROM "UserConnection" WHERE id = $1',
                [id]
            );
            return { success: true, result: userConnection.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateUserConnection(fastify: any, id: number, data: updateUserConnectionDTO): Promise<userConnectionResponseDTO> {
        try {
            const userConnection = await fastify.pg.query(
                'UPDATE "UserConnection" SET "accessToken" = $1, "refreshToken" = $2, "expiresAt" = $3, "scope" = $4, "tokenType" = $5 WHERE id = $6 RETURNING *',
                [data.accessToken, data.refreshToken, data.expiresAt, data.scope, data.tokenType, id]
            );
            return { success: true, result: userConnection.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteUserConnection(fastify: any, id: number): Promise<userConnectionResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "UserConnection" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'UserConnection deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}