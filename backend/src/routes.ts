import { FastifyInstance } from 'fastify';
import {
  getOccupants,
  getOccupantsHistory,
  updateOccupants
} from './influx/sensors';
import { NodePgDatabase } from 'drizzle-orm/node-postgres';
import WebSocket from 'ws';
import { OurPGDatabase } from './types';
import { broadcastOccupants } from './websocket/flushes';

export const setupRoutes = (
  server: FastifyInstance,
  pg: OurPGDatabase,
  wss: WebSocket.Server
) => {
  //Frontend websocket connection
  wss.on('connection', (ws) => {
    // Temporary connection log.
    console.log('A new client connected!');

    // Temporary verification message.
    ws.send('Welcome to the WebSocket server!');

    // Potential future use of messages from client.
    // ws.on('message', (message) => {});

    ws.on('close', () => {
      console.log('Client disconnected');
    });
  });

  //Ping test
  server.get('/api/ping', async (request, reply) => {
    return 'pong\n';
  });

  server.get('/api/sensors/occupants', async (request, reply) => {
    return await getOccupants();
  });

  server.get('/api/sensors/occupants/history', async (request, reply) => {
    const { type }: any = request.body ?? { type: 'json' };
    const occupants = await getOccupantsHistory();

    return type === 'csv'
      ? [
          'Timestamp,Sensor ID,Occupants',
          ...occupants.map((o) => `${o.timestamp},${o.sensorId},${o.occupants}`)
        ].join('\n')
      : occupants;
  });

  server.post('/api/sensors/report', async (request, reply) => {
    const { firmwareVersion, sensorId, occupants, authorization }: any =
      request.body;

    if (authorization !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return 'Unauthorized';
    }

    updateOccupants(firmwareVersion, sensorId, occupants);
    broadcastOccupants(wss, occupants, sensorId);
    return 'Success';
  });

  server.get('/api/sensors/report/test', async (request, reply) => {
    const { authorization }: any = request.body;

    if (authorization !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return 'Unauthorized';
    }

    const randomOccupants = Math.floor(Math.random() * 10);
    updateOccupants('1.0.0', 'sensor1', randomOccupants);
    broadcastOccupants(wss, randomOccupants, 'sensor1');
    return 'Success';
  });
};
