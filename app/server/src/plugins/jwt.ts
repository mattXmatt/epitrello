import { FastifyPluginAsync } from "fastify";
import fp from 'fastify-plugin';
import fastifyJwt from "@fastify/jwt";
import { FastifyRequest, FastifyReply } from "fastify";

const jwtPlugin: FastifyPluginAsync = async (fastify) => {
    fastify.register(fastifyJwt, {
        secret: "supersecret",
        cookie: {
            cookieName: 'token',
            signed: false,
        }
    });

    fastify.decorate("authenticate", async function (request: FastifyRequest, reply: FastifyReply) {
        try {
            await request.jwtVerify();
        } catch (err) {
            reply.send(err);
        }
    });
};

export default fp(jwtPlugin);