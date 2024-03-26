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
import crypto from 'crypto';
import { rooms, sensors } from './db/schema';
import { getPG } from './db/config';
import { eq } from 'drizzle-orm';
import { getExampleTimePoints, rooms } from './db/exampleData';

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

    return rooms.filter((room) => room.buildingId === buildingID);
  });

  //Possibly just a placeholder, returns example data.
  server.get('/api/all_rooms', async (request, reply) => {
    return rooms;
  });

  //Possibly just a placeholder, returns example data.
  server.get('/api/points_for_room/:roomID', async (request, reply) => {
    const parameters = request.params as any;
    const roomID = parameters.roomID;
    if (!roomID) {
      reply.code(400);
      return 'Must include a room ID in request.';
    }
    reply.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    reply.header('Access-Control-Allow-Methods', 'GET, POST');
    return getExampleTimePoints();
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
    const { firmwareVersion, sensorId, occupants }: any = request.body;
    const { authorization }: any = request.headers;

    console.log('Received authorization', authorization);

    if (authorization !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return 'Unauthorized';
    }

    updateOccupants(firmwareVersion, sensorId, occupants);
    broadcastOccupants(wss, occupants, sensorId);
    return 'Success';
  });

  server.get('/api/rooms/status', async (request, reply) => {
    const pg = await getPG();
    const roomsStatic = await pg
      .select()
      .from(rooms)
      .innerJoin(sensors, eq(sensors.room, rooms.id));
    const sensorStatus = await getOccupants();

    const roomsStatus = roomsStatic.reduce((acc: any, room: any) => {
      const sensor = sensorStatus.find(
        (sensor) => sensor.sensorId === room.sensors.id
      );

      if (!sensor) return acc;
      acc.push({ ...sensor, room: room.rooms.name });
      return acc;
    }, []);
    return roomsStatus;
  });

  server.get('/api/sensors/report/test', async (request, reply) => {
    const { authorization }: any = request.headers;

    if (authorization !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return 'Unauthorized';
    }

    const randomOccupants = Math.floor(Math.random() * 10);
    updateOccupants('1.0.0', 'sensor1', randomOccupants);
    broadcastOccupants(wss, randomOccupants, 'sensor1');
    return 'Success';
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
