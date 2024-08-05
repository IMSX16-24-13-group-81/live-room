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
  addSensors
} from './status/rooms';


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

  server.post('/api/rooms', async (request, reply) => {
    const { name, building, coordinates, description}: any =
    request.body;
  const { authorization }: any = request.headers;

  if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
    reply.code(401);
    return { error: 'Unauthorized' };
  }
  addRoom(name,building,coordinates, description);
  return 'Success';
  });
  server.post('/api/sensors', async (request, reply) => {
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

  server.post('/api/sensors/report', async (request, reply) => {
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

  // New endpoint for the new sensor VS135-hl
  server.post('/api/sensors/report/vs135hl', async (request, reply) => {
    const { firmware_version, device_mac, trigger_data }: any = request.body;
    const { authorization }: any = request.headers;

    if ((authorization ?? '') !== process.env.AUTHORIZATION_TOKEN) {
      reply.code(401);
      return { error: 'Unauthorized' };
    }  
   
    let totIn = 0;
    let totOut = 0;

    trigger_data.forEach((line: any) => {
      totIn += line.in;
      totOut += line.out;
    });
    const occupants = totIn - totOut;
    const firmwareVersion = firmware_version;
    const sensorId = device_mac;

    //test
    const radarState  = 0; //default for test
    const pirState = false; //default for test
  
    updateOccupants(firmwareVersion, sensorId, occupants, radarState, pirState);
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
