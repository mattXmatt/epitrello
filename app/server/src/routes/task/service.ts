import { createTaskDTO, updateTaskDTO, taskResponseDTO } from "./interfaces.js";

export const taskService = {
    async createTask(fastify: any, data: createTaskDTO, userId: number): Promise<taskResponseDTO> {
        const client = await fastify.pg.connect();
        try {
            await client.query('BEGIN');
            const maxIndexRes = await client.query('SELECT MAX("taskIndex") as max_index FROM "Task" WHERE "boardColumnId" = $1', [data.boardColumnId]);
            const nextIndex = (maxIndexRes.rows[0].max_index || 0) + 1;
            const startingDate = new Date();

            const newTask = await client.query(
                'INSERT INTO "Task" ("taskName", "taskIndex", "boardColumnId", "description", "startingDate", "createdBy") VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
                [data.taskName, nextIndex, data.boardColumnId, data.description || '', startingDate, userId]
            );

            await client.query('COMMIT');
            return { success: true, result: newTask.rows[0] };
        } catch (error: any) {
            await client.query('ROLLBACK');
            return { success: false, message: error.message };
        } finally {
            client.release();
        }
    },

    async getTasks(fastify: any, boardColumnId: number): Promise<taskResponseDTO> {
        try {
            const query = `
                SELECT t.*, 
                       (u.name || ' ' || u.surname) as "creatorName",
                       COALESCE((
                           SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name || ' ' || ui.surname))
                           FROM assignee a
                           JOIN "UserInfo" ui ON a."userId" = ui.id
                           WHERE a."cardId" = t.id AND a."cardType" = 'task'
                       ), '[]') as assignees
                FROM "Task" t 
                LEFT JOIN "UserInfo" u ON t."createdBy" = u.id 
                WHERE t."boardColumnId" = $1 
                ORDER BY t."taskIndex"
            `;
            const tasks = await fastify.pg.query(query, [boardColumnId]);
            return { success: true, result: tasks.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getTaskById(fastify: any, id: number): Promise<taskResponseDTO> {
        try {
            const query = `
                SELECT t.*, 
                    (u.name || ' ' || u.surname) as "creatorName",
                    COALESCE((
                        SELECT json_agg(json_build_object('id', ui.id, 'name', ui.name || ' ' || ui.surname))
                        FROM assignee a
                        JOIN "UserInfo" ui ON a."userId" = ui.id
                        WHERE a."cardId" = t.id AND a."cardType" = 'task'
                    ), '[]') as assignees
                FROM "Task" t 
                LEFT JOIN "UserInfo" u ON t."createdBy" = u.id 
                WHERE t.id = $1
            `;
            const task = await fastify.pg.query(query, [id]);
            return { success: true, result: task.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateTask(fastify: any, id: number, data: updateTaskDTO): Promise<taskResponseDTO> {
        try {
            const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
            const values = Object.values(data).filter(value => value !== undefined);
            if (fields.length === 0) return { success: false, message: "No fields to update" };

            const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
            const query = `UPDATE "Task" SET ${setClause}, "updatedAt" = NOW() WHERE id = $${fields.length + 1}`;
            await fastify.pg.query(query, [...values, id]);

            return await this.getTaskById(fastify, id);
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteTask(fastify: any, id: number): Promise<taskResponseDTO> {
        try {
            await fastify.pg.query('DELETE FROM "Task" WHERE id = $1', [id]);
            return { success: true, message: 'Task deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}