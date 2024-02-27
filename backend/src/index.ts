import fastify from "fastify";
import { heartbeat, updateOccupants } from "./influx/sensors";

const server = fastify();

server.get("/api/ping", async (request, reply) => {
  return "pong\n";
});

server.post("/api/sensors/report", async (request, reply) => {
  const { occupants, sensorId, authorization }: any = request.body;
  updateOccupants(occupants, sensorId);
  return "Success";
});

server.get("/api/sensors/report/test", async (request, reply) => {
  const randomOccupants = Math.floor(Math.random() * 10);
  updateOccupants(randomOccupants, "sensor1");
  return "Success";
});

server.post("/api/sensors/heartbeat", async (request, reply) => {
  const { sensorId, firmwareVersion, authorization }: any = request.body;
  heartbeat(sensorId, firmwareVersion);
  return "Success";
});

server.get("/api/sensors/heartbeat/test", async (request, reply) => {
  heartbeat("sensor1", "0.0.1");
  return "Success";
});

server.listen({ port: 8080, host: "0.0.0.0" }, (err, address) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Server listening at ${address}`);
});
