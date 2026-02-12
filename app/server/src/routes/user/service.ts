import { createUserDTO, updateUserDTO, userResponseDTO } from "./interfaces.js";

export const userService = {
    async createUser(fastify: any, data: createUserDTO): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'INSERT INTO "UserInfo" (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email',
                [data.name, data.surname, data.email, data.password]
            );
            return { success: true, result: rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getUsers(fastify: any): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'SELECT id, name, surname, email FROM "UserInfo"'
            );
            return { success: true, result: rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getUserById(fastify: any, id: number): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'SELECT id, name, surname, email, password FROM "UserInfo" WHERE id = $1',
                [id]
            );
            if (rows.length === 0) {
                return { success: false, message: "Utilisateur non trouvé" };
            }
            return { success: true, result: rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getUserByEmail(fastify: any, email: string): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'SELECT id, name, surname, email, password FROM "UserInfo" WHERE email = $1',
                [email]
            );
            if (rows.length === 0) {
                return { success: false, message: "Utilisateur non trouvé" };
            }
            return { success: true, result: rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateUser(fastify: any, id: number, data: updateUserDTO): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'UPDATE "UserInfo" SET name = $1, surname = $2, email = $3, password = $4 WHERE id = $5 RETURNING id, name, surname, email',
                [data.name, data.surname, data.email, data.password, id]
            );
            return { success: true, result: rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteUser(fastify: any, id: number): Promise<userResponseDTO> {
        try {
            const { rows } = await fastify.pg.query(
                'DELETE FROM "UserInfo" WHERE id = $1  RETURNING id',
                [id]
            );
            return { success: true, result: rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}