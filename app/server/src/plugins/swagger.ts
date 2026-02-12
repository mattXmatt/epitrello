import fp from 'fastify-plugin';
import swagger, { FastifySwaggerOptions } from '@fastify/swagger';
import swaggerUi, { FastifySwaggerUiOptions } from '@fastify/swagger-ui';
import { FastifyPluginAsync } from 'fastify';

const swaggerPlugin: FastifyPluginAsync = async (fastify) => {
    const swaggerOptions = {
        openapi: {
            info: {
                title: 'EpiTrello API',
                description: 'Documentation de l\'API pour le projet EpiTrello.',
                version: '1.0.0',
            },
            host: process.env.API_HOST || 'localhost:3000',
            schemes: ['http', 'https'],
            consumes: ['application/json'],
            produces: ['application/json'],
        },
    };

    const swaggerUiOptions: FastifySwaggerUiOptions = {
        routePrefix: '/swagger',
        uiConfig: {
            docExpansion: 'list',
            deepLinking: false,
        },
        staticCSP: true,
        transformSpecificationClone: true
    };

    fastify.register(swagger, swaggerOptions);
    fastify.register(swaggerUi, swaggerUiOptions);
};

export default fp(swaggerPlugin);
