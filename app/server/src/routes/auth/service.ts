import { FastifyInstance } from 'fastify';
import bcrypt from 'bcrypt';
import { User } from './interfaces.js';

export const authService = {
    async register(fastify: FastifyInstance, data: any): Promise<any> {
        const { name, surname, email, password } = data;
        const hashedPassword = await bcrypt.hash(password, 10);
        try {
            const newUserRes = await fastify.pg.query(
                'INSERT INTO "UserInfo" (name, surname, email, password) VALUES ($1, $2, $3, $4) RETURNING id, name, surname, email',
                [name, surname, email, hashedPassword]
            );
            const newUser = newUserRes.rows[0];
            const token = fastify.jwt.sign({ id: newUser.id, email: newUser.email });
            return { success: true, result: newUser, token };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async login(fastify: FastifyInstance, data: any): Promise<any> {
        const { email, password } = data;
        try {
            const userRes = await fastify.pg.query('SELECT * FROM "UserInfo" WHERE email = $1', [email]);
            const user = userRes.rows[0];

            if (!user) {
                return { success: false, message: 'Invalid credentials' };
            }

            const isPasswordValid = await bcrypt.compare(password, user.password);

            if (!isPasswordValid) {
                return { success: false, message: 'Invalid credentials' };
            }

            const token = fastify.jwt.sign({ id: user.id, email: user.email });
            return { success: true, token };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getMe(fastify: FastifyInstance, userId: number): Promise<any> {
        try {
            const userRes = await fastify.pg.query('SELECT id, name, surname, email FROM "UserInfo" WHERE id = $1', [userId]);
            const user = userRes.rows[0];
            return { success: true, result: user };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
};
