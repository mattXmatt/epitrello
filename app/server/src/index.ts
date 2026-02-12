import fastify from "fastify";
import cookie from '@fastify/cookie';
import app from './app.js';

const server = fastify({
  logger: true
});

server.register(cookie, {
  secret: "un-secret-pour-signer-les-cookies",
  parseOptions: {}
});

server.register(app);

const start = async () => {
  try {
    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
    await server.listen({ port: port, host: '0.0.0.0' });
    console.log(`Server listening at http://localhost:${port}`);
  } catch (err: any) {
    server.log.error(err);
    process.exit(1);
  }
};

start();

export default server;