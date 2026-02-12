import { createEventMeetingDTO, updateEventMeetingDTO, eventMeetingResponseDTO } from "./interfaces.js";

export const eventMeetingService = {
    async createEventMeeting(fastify: any, data: createEventMeetingDTO): Promise<eventMeetingResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            if (data.type === 'meeting') {
                const start = new Date(data.startingDate).getTime();
                const end = new Date(data.endingDate).getTime();
                const durationInHours = (end - start) / (1000 * 60 * 60);

                if (durationInHours > 5) {
                    return { success: false, message: "Un meeting ne peut pas dépasser 5 heures." };
                }
            }

            await client.query('BEGIN');

            const maxIndexRes = await client.query('SELECT MAX("eventIndex") as max_index FROM "EventMeeting" WHERE "boardColumnId" = $1', [data.boardColumnId]);
            const nextIndex = (maxIndexRes.rows[0].max_index || 0) + 1;

            const createdBy = 1;

            const newEventMeeting = await client.query(
                'INSERT INTO "EventMeeting" ("eventName", "eventIndex", "boardColumnId", "description", "startingDate", "endingDate", "createdBy", "type") VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
                [data.eventName, nextIndex, data.boardColumnId, data.description || '', data.startingDate, data.endingDate, createdBy, data.type]
            );

            await client.query('COMMIT');
            return { success: true, result: newEventMeeting.rows[0] };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },
    async getEventMeetings(fastify: any, boardColumnId: number): Promise<eventMeetingResponseDTO> {
        try {
            const eventMeetings = await fastify.pg.query(
                'SELECT * FROM "EventMeeting" WHERE "boardColumnId" = $1',
                [boardColumnId]
            );
            return { success: true, result: eventMeetings.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getEventMeetingById(fastify: any, id: number): Promise<eventMeetingResponseDTO> {
        try {
            const eventMeeting = await fastify.pg.query(
                'SELECT * FROM "EventMeeting" WHERE id = $1',
                [id]
            );
            return { success: true, result: eventMeeting.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateEventMeeting(fastify: any, id: number, data: updateEventMeetingDTO): Promise<eventMeetingResponseDTO> {
        try {
            const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
            const values = Object.values(data).filter(value => value !== undefined);
            
            if (fields.length === 0) {
                return { success: false, message: "No fields to update" };
            }

            const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');

            const query = `UPDATE "EventMeeting" SET ${setClause}, "updatedAt" = NOW() WHERE id = $${fields.length + 1} RETURNING *`;
            const queryValues = [...values, id];

            const eventMeeting = await fastify.pg.query(query, queryValues);
            return { success: true, result: eventMeeting.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteEventMeeting(fastify: any, id: number): Promise<eventMeetingResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "EventMeeting" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'EventMeeting deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}