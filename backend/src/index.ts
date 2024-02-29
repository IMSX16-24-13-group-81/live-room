import fastify from 'fastify';

import { getPG } from './db/config';
import { setupRoutes } from './routes';
import WebSocket from 'ws';

//For async runtime without top-level-async-tricks.
const main = async () => {
  const server = fastify();
  const pg = await getPG();
  const wss = new WebSocket.Server({ port: 8079 });

  server.listen({ port: 8080, host: '0.0.0.0' }, (err, address) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }
    console.log(`Server listening at ${address}`);
  });
  setupRoutes(server, pg, wss);
};

main();
