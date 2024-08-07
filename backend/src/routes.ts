import { FastifyInstance } from 'fastify';
import {
  getDeadSensors,
  getOccupants,
  updateOccupants
} from './influx/sensors';
//import WebSocket from 'ws';
import { OurPGDatabase } from './types';
import { broadcastOccupants } from './websocket/flushes';
import crypto from 'crypto';
import {
  getRoomStatusHistory,
  getRoomsStatus,
  addRoom,
  addSensors,
  findBuilding
} from './status/rooms';
const fs = require('fs');
const path = require('path');
import {
  addRoomSchema,
  addSensorSchema,
  sensorReportSchema
} from './swagger/swaggerSchema';


export const setupRoutes = (
  server: FastifyInstance,
  pg: OurPGDatabase //,
  //wss: WebSocket.Server
  
) => {
  /*
  //Ws not used
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
    */

  
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

  server.post('/api/rooms', {schema : addRoomSchema}, async (request, reply) => {
    const { name, building, coordinates, description}: any =
    request.body;
  const { authorization }: any = request.headers;

  if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
    reply.code(401);
    return { error: 'Unauthorized' };
  }
  const foundBuilding = await findBuilding(building);
  if (foundBuilding) {
  await addRoom(name,building,coordinates, description);
  return 'Success';
  } else{
    reply.code(400);
    return { error: 'Building doesnt exist' };
  }
  });
  server.post('/api/sensors', {schema : addSensorSchema},async (request, reply) => {
    const { sensorId, roomId}: any =
    request.body;
  const { authorization }: any = request.headers;

  if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
    reply.code(401);
    return { error: 'Unauthorized' };
  }
  addSensors(sensorId,roomId);
  return 'Success';
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

  server.post('/api/sensors/report', {schema : sensorReportSchema}, async (request, reply) => {
    const { firmwareVersion, sensorId, occupants, radarState, pirState }: any =
      request.body;
    const { authorization }: any = request.headers;

    if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }

    //updateOccupants(firmwareVersion, sensorId, roomName, occupants, radarState, pirState, pg);
    //broadcastOccupants(wss, occupants, sensorId, roomName);
    //return 'Success'; 
    
    updateOccupants(firmwareVersion, sensorId, occupants, radarState, pirState);
      return 'Success';
  });   

  //Test of route setup and sensor connection
  server.get('/api/sensors/report/vs135hl', async (request, reply) => {
    return { message: "This is a GET request test for /vs135hl" };
  });

  // New endpoint for the new sensor VS135-hl
  server.post('/api/sensors/report/vs135hl', async (request, reply) => {
    const { device_info, total_data }: any = request.body;
    const { authorization }: any = request.headers;

    // Extract username and password from the Authorization header
    const base64Credentials = authorization?.split(' ')[1] || '';
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [Username, Password] = credentials.split(':');

    if (Username !== process.env.INFLUXDB_USER || Password !== process.env.INFLUXDB_PASSWORD) {
      reply.code(401).header('WWW-Authenticate', 'Basic realm="Access to the staging site"');
      return { error: 'Unauthorized' };
    } 

    let totIn = 0;
    let totOut = 0;

    total_data.forEach((line: any) => {
      totIn += line.in_counted;
      totOut += line.out_counted;
    });
    const occupants = totIn - totOut;
    const firmwareVersion = device_info.firmware_version;
    const sensorId = device_info.device_mac;
  
    updateOccupants(firmwareVersion, sensorId, occupants);
    return 'Success';
  });


  server.get('/api/rooms/status', async (request, reply) => {
    return await getRoomsStatus();
  });

/* Randomized generated data from first test of software. No longer in use.
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
      'Room1',
      randomOccupants,
      randomOccupants,
      randomState
    );
    broadcastOccupants(wss, randomOccupants, 'sensor1', 'Room1');
    return {
      firmwareVersion: '1.0.0',
      sensorId: 'sensor1',
      roomName: 'Room1',
      occupants: randomOccupants,
      radarState: randomOccupants,
      pirState: randomState
    };
  });
*/

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
