import { Point } from "@influxdata/influxdb-client";
import influxClient from "./influxClient";

let org = process.env.INFLUXDB_ORG || `liveinfo`;
let bucket = process.env.INFLUXDB_BUCKET || `liveinfo`;

let writeClient = influxClient.getWriteApi(org, bucket, "ns");

const updateOccupants = (occupants: number, sensorId: string) => {
  let point = new Point("sensors")
    .tag("sensorId", sensorId)
    .intField("occupants", occupants);

  writeClient.writePoint(point);
  writeClient.flush();
};

export { updateOccupants };
