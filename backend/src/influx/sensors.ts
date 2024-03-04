import { Point } from '@influxdata/influxdb-client';
import influxClient from './influxClient';

let org = process.env.INFLUXDB_ORG || `liveinfo`;
let bucket = process.env.INFLUXDB_BUCKET || `liveinfo`;

let writeClient = influxClient.getWriteApi(org, bucket, 'ns');

const updateOccupants = (occupants: number, sensorId: string) => {
  let point = new Point('sensors')
    .tag('sensorId', sensorId)
    .intField('occupants', occupants);

  writeClient.writePoint(point);
  writeClient.flush();
};

const getOccupants = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> last()`;
  let result = await queryApi.collectRows(query);
  return result
    .filter(
      (row: any) =>
        row._field === 'occupants' &&
        row.result === '_result' &&
        row._value !== undefined
    )
    .map((row: any) => {
      return {
        sensorId: row.sensorId,
        occupants: row._value,
        lastReported: row._time,
        // TODO: Use heartbeat timestamp
        lastSeen: row._time
      };
    });
};

const getOccupantsHistory = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")`;
  let result = await queryApi.collectRows(query);
  return result
    .filter(
      (row: any) =>
        row._field === 'occupants' &&
        row.result === '_result' &&
        row._value !== undefined
    )
    .map((row: any) => {
      return {
        sensorId: row.sensorId,
        occupants: row._value,
        timestamp: row._time
      };
    });
};

export { getOccupants, getOccupantsHistory, updateOccupants };
