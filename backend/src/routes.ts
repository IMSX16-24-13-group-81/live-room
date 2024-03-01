import { FastifyInstance } from 'fastify';
import {
  getOccupants,
  getOccupantsHistory,
  heartbeat,
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
    const { occupants, sensorId, authorization }: any = request.body;
    updateOccupants(occupants, sensorId);
    broadcastOccupants(wss, occupants, sensorId);
    return 'Success';
  });

  server.get('/api/sensors/report/test', async (request, reply) => {
    const randomOccupants = Math.floor(Math.random() * 10);
    updateOccupants(randomOccupants, 'sensor1');
    broadcastOccupants(wss, randomOccupants, 'sensor1');
    return 'Success';
  });

  server.post('/api/sensors/heartbeat', async (request, reply) => {
    const { sensorId, firmwareVersion, authorization }: any = request.body;
    heartbeat(sensorId, firmwareVersion);
    return 'Success';
  });

  server.get('/api/sensors/heartbeat/test', async (request, reply) => {
    heartbeat('sensor1', '0.0.1');
    return 'Success';
  });
};
