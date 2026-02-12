import { createEventPresenceDTO, updateEventPresenceDTO, eventPresenceResponseDTO } from "./interfaces.js";

export const eventPresenceService = {
    async createEventPresence(fastify: any, data: createEventPresenceDTO): Promise<eventPresenceResponseDTO> {
        try {
            const newEventPresence = await fastify.pg.query(
                'INSERT INTO "eventPresence" ("eventId", "userId", "status") VALUES ($1, $2, $3) RETURNING *',
                [data.eventId, data.userId, data.status]
            );
            return { success: true, result: newEventPresence.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getEventPresences(fastify: any, eventId: number): Promise<eventPresenceResponseDTO> {
        try {
            const eventPresences = await fastify.pg.query(
                'SELECT * FROM "eventPresence" WHERE "eventId" = $1',
                [eventId]
            );
            return { success: true, result: eventPresences.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getEventPresenceById(fastify: any, id: number): Promise<eventPresenceResponseDTO> {
        try {
            const eventPresence = await fastify.pg.query(
                'SELECT * FROM "eventPresence" WHERE id = $1',
                [id]
            );
            return { success: true, result: eventPresence.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateEventPresence(fastify: any, id: number, data: updateEventPresenceDTO): Promise<eventPresenceResponseDTO> {
        try {
            const eventPresence = await fastify.pg.query(
                'UPDATE "eventPresence" SET "status" = $1 WHERE id = $2 RETURNING *',
                [data.status, id]
            );
            return { success: true, result: eventPresence.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteEventPresence(fastify: any, id: number): Promise<eventPresenceResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "eventPresence" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'EventPresence deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}