import WebSocket from 'ws';
import { OccupantsWebsocketMessage } from '../types';

export const broadcastOccupants = (
  wss: WebSocket.Server,
  occupants: number,
  sensorId: string
) => {
  const message: OccupantsWebsocketMessage = {
    occupants,
    sensorId
  };
  const messageString = JSON.stringify(message);
  wss.clients.forEach(function each(client) {
    if (client.readyState === WebSocket.OPEN) {
      client.send(messageString);
    }
  });
};
