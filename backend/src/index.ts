import fastify from "fastify";
import { heartbeat, updateOccupants } from "./influx/sensors";

const server = fastify();

server.get("/ping", async (request, reply) => {
  return "pong\n";
});

server.get("/sensors/report", async (request, reply) => {
  const randomOccupants = Math.floor(Math.random() * 10);
  updateOccupants(randomOccupants, "sensor1");
  return "Success";
});

server.get("/sensors/heartbeat", async (request, reply) => {
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
