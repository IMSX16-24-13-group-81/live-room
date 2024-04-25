import { FastifyInstance } from 'fastify';
import {
  getDeadSensors,
  getOccupants,
  updateOccupants
} from './influx/sensors';
import WebSocket from 'ws';
import { OurPGDatabase } from './types';
import { broadcastOccupants } from './websocket/flushes';
import crypto from 'crypto';
import {
  getRoomStatusHistory,
  getRoomsStatus
} from './status/rooms';

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

  //Possibly just a placeholder, returns example data.
  server.get('/api/rooms/:buildingID', async (request, reply) => {
    const parameters = request.params as any;
    const buildingID = parameters.buildingID;

    if (!buildingID) {
      reply.code(400);
      return 'Must include a building ID in request.';
    }

    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST');

    return getRoomsStatus(buildingID);
  });

  //Possibly just a placeholder, returns example data.
  server.get('/api/rooms', async (request, reply) => {
    return getRoomsStatus();
  });

  server.get('/api/rooms/occupants/history/:roomID', async (request, reply) => {
    const { type }: any = request.body ?? { type: 'json' };
    const { roomID }: any = request.params;

    if (!roomID) {
      reply.code(400);
      return { error: 'Must include a room ID in request.' };
    }

    reply.header('Access-Control-Allow-Origin', '*');
    reply.header('Access-Control-Allow-Methods', 'GET, POST');

    const history = await getRoomStatusHistory(roomID);
    return type === 'csv'
      ? ['Timestamp,Occupants', ...history.map((o) => `${o.time},${o.y}`)].join(
          '\n'
        )
      : history;
  });

  server.post('/api/sensors/report', async (request, reply) => {
    const { firmwareVersion, sensorId, occupants, radarState, pirState }: any =
      request.body;
    const { authorization }: any = request.headers;

    if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    updateOccupants(firmwareVersion, sensorId, occupants, radarState, pirState);
    broadcastOccupants(wss, occupants, sensorId);
    return 'Success';
  });

  server.get('/api/rooms/status', async (request, reply) => {
    return await getRoomsStatus();
  });

  server.get('/api/sensors/report/test', async (request, reply) => {
    const { authorization }: any = request.headers;

    if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    const randomOccupants = Math.floor(Math.random() * 10);
    const randomState = Math.random() > 0.5;
    updateOccupants(
      '1.0.0',
      'sensor1',
      randomOccupants,
      randomOccupants,
      randomState
    );
    broadcastOccupants(wss, randomOccupants, 'sensor1');
    return {
      firmwareVersion: '1.0.0',
      sensorId: 'sensor1',
      occupants: randomOccupants,
      radarState: randomOccupants,
      pirState: randomState
    };
  });

  server.get('/api/sensors/dead', async (request, reply) => {
    return await getDeadSensors();
  });

  server.setErrorHandler((error, _, reply) => {
    const errorDigest = crypto
      .createHash('sha1')
      .update(error.message)
      .digest('hex');
    console.error(`Error occurred with digest ${errorDigest}\n${error.stack}`);
    reply
      .code(500)
      .send({ error: 'Internal server error', digest: errorDigest });
  });
};
