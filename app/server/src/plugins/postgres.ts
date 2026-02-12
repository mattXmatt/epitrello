import fastifyPostgres from '@fastify/postgres';
import { FastifyPluginAsync } from "fastify";
import fp from 'fastify-plugin';


const postgresPlugin: FastifyPluginAsync = async (fastify, opts) => {
    fastify.register(fastifyPostgres, {
        connectionString: process.env.DATABASE_URL || 'postgresql://user:password@localhost:5432/mydatabase',
    });
};

export default fp(postgresPlugin);