import { createBoardColumnDTO, updateBoardColumnDTO, boardColumnResponseDTO } from "./interfaces.js";

export const boardColumnService = {
    async createBoardColumn(fastify: any, data: createBoardColumnDTO): Promise<boardColumnResponseDTO> {
        try {
            const newColumn = await fastify.pg.query(
                'INSERT INTO "boardColumn" ("columnName", "description", "boardId", "columnIndex", "color") VALUES ($1, $2, $3, $4, $5) RETURNING *',
                [data.columnName, data.description, data.boardId, data.columnIndex, data.color || 'transparent']
            );
            return { success: true, result: newColumn.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardColumns(fastify: any, boardId: number): Promise<boardColumnResponseDTO> {
        try {
            const columns = await fastify.pg.query(
                'SELECT * FROM "boardColumn" WHERE "boardId" = $1 ORDER BY "columnIndex"',
                [boardId]
            );
            return { success: true, result: columns.rows };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async getBoardColumnById(fastify: any, id: number): Promise<boardColumnResponseDTO> {
        try {
            const column = await fastify.pg.query(
                'SELECT * FROM "boardColumn" WHERE id = $1',
                [id]
            );
            return { success: true, result: column.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async updateBoardColumn(fastify: any, id: number, data: updateBoardColumnDTO): Promise<boardColumnResponseDTO> {
        try {
            // CONSTRUCTION DYNAMIQUE DE LA REQUÊTE POUR NE METTRE À JOUR QUE LES CHAMPS FOURNIS
            const fields = Object.keys(data).filter(key => (data as any)[key] !== undefined);
            const values = Object.values(data).filter(value => value !== undefined);
            
            if (fields.length === 0) return { success: false, message: "No fields to update" };

            const setClause = fields.map((field, index) => `"${field}" = $${index + 1}`).join(', ');
            const query = `UPDATE "boardColumn" SET ${setClause} WHERE id = $${fields.length + 1} RETURNING *`;
            
            const result = await fastify.pg.query(query, [...values, id]);
            
            return { success: true, result: result.rows[0] };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    },

    async deleteBoardColumn(fastify: any, id: number): Promise<boardColumnResponseDTO> {
        try {
            await fastify.pg.query(
                'DELETE FROM "boardColumn" WHERE id = $1',
                [id]
            );
            return { success: true, message: 'Column deleted successfully' };
        } catch (error: any) {
            return { success: false, message: error.message };
        }
    }
}   