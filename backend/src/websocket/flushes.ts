import WebSocket from 'ws';
import { OccupantsWebsocketMessage } from '../types';

export const broadcastOccupants = (
  wss: WebSocket.Server,
  occupants: number,
  sensorId: string,
  roomName: string
) => {
  const message: OccupantsWebsocketMessage = {
    occupants,
    sensorId,
    roomName
  };
  const messageString = JSON.stringify(message);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
};
