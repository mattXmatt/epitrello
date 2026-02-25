import { createEventMeetingDTO, updateEventMeetingDTO, eventMeetingResponseDTO } from "./interfaces.js";

export const eventMeetingService = {
    async createEventMeeting(fastify: any, data: createEventMeetingDTO, userId: number): Promise<eventMeetingResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            await client.query('BEGIN');
            const maxIndexRes = await client.query('SELECT MAX("eventIndex") as max_index FROM "EventMeeting" WHERE "boardColumnId" = $1', [data.boardColumnId]);
            const nextIndex = (maxIndexRes.rows[0].max_index || 0) + 1;

            const newEvent = await client.query(
                'INSERT INTO "EventMeeting" ("eventName", "eventIndex", "boardColumnId", "description", "startingDate", "endingDate", "location", "type", "createdBy") VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
                [data.eventName, nextIndex, data.boardColumnId, data.description || '', data.startingDate || new Date(), data.endingDate || null, data.location || '', data.type || 'event', userId]
            );

            await client.query('COMMIT');
            return { success: true, result: newEvent.rows[0] };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getEventMeetings(fastify: any, boardColumnId: number): Promise<eventMeetingResponseDTO> {
        try {
            const query = `
                SELECT em.*, 
                       (u.name || ' ' || u.surname) as "creatorName",
                       COALESCE((SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name || ' ' || ui.surname)) FROM "assignee" a JOIN "UserInfo" ui ON a."userId" = ui.id WHERE a."cardId" = em.id AND a."cardType" = 'event'), '[]') as assignees,
                       COALESCE((SELECT json_agg(json_build_object('id', tg.id, 'name', tg.name, 'color', tg.color)) FROM "cardTag" ct JOIN "tags" tg ON ct."tagId" = tg.id WHERE ct."cardId" = em.id AND ct."cardType" = 'event'), '[]') as tags,
                       COALESCE((SELECT json_agg(json_build_object('id', c.id, 'text', c.text, 'createdAt', c."createdAt", 'userName', uc.name, 'userId', c."userId")) FROM "Comment" c JOIN "UserInfo" uc ON c."userId" = uc.id WHERE c."cardId" = em.id AND c."cardType" = 'event'), '[]') as comments
                FROM "EventMeeting" em 
                LEFT JOIN "UserInfo" u ON em."createdBy" = u.id 
                WHERE em."boardColumnId" = $1 
                ORDER BY em."eventIndex"
            `;
            const events = await fastify.pg.query(query, [boardColumnId]);
            return { success: true, result: events.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getEventMeetingById(fastify: any, id: number): Promise<eventMeetingResponseDTO> {
        try {
            const query = `
                SELECT em.*, 
                       (u.name || ' ' || u.surname) as "creatorName",
                       COALESCE((SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name || ' ' || ui.surname)) FROM "assignee" a JOIN "UserInfo" ui ON a."userId" = ui.id WHERE a."cardId" = em.id AND a."cardType" = 'event'), '[]') as assignees,
                       COALESCE((SELECT json_agg(json_build_object('id', tg.id, 'name', tg.name, 'color', tg.color)) FROM "cardTag" ct JOIN "tags" tg ON ct."tagId" = tg.id WHERE ct."cardId" = em.id AND ct."cardType" = 'event'), '[]') as tags,
                       COALESCE((SELECT json_agg(json_build_object('id', c.id, 'text', c.text, 'createdAt', c."createdAt", 'userName', uc.name, 'userId', c."userId")) FROM "Comment" c JOIN "UserInfo" uc ON c."userId" = uc.id WHERE c."cardId" = em.id AND c."cardType" = 'event'), '[]') as comments
                FROM "EventMeeting" em 
                LEFT JOIN "UserInfo" u ON em."createdBy" = u.id 
                WHERE em.id = $1
            `;
            const event = await fastify.pg.query(query, [id]);
            return { success: true, result: event.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateEventMeeting(fastify: any, id: number, data: updateEventMeetingDTO): Promise<eventMeetingResponseDTO> {
        try {
            const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
            const values = Object.values(data).filter(value => value !== undefined);
            if (fields.length === 0) return { success: false, message: "No fields to update" };

            const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
            const query = `UPDATE "EventMeeting" SET ${setClause}, "updatedAt" = NOW() WHERE id = $${fields.length + 1}`;
            await fastify.pg.query(query, [...values, id]);

            return await this.getEventMeetingById(fastify, id);
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteEventMeeting(fastify: any, id: number): Promise<eventMeetingResponseDTO> {
        try {
            await fastify.pg.query('DELETE FROM "EventMeeting" WHERE id = $1', [id]);
            return { success: true, message: 'Event deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}