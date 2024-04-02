import { Point } from '@influxdata/influxdb-client';
import influxClient from './influxClient';
import { SensorState } from '../types';

let org = process.env.INFLUXDB_ORG ?? `liveinfo`;
let bucket = process.env.INFLUXDB_BUCKET ?? `liveinfo`;

let writeClient = influxClient.getWriteApi(org, bucket, 'ns');

const convertResults = (results: any[]): SensorState[] => {
  return results
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
        reportedAt: row._time
      };
    });
};

export const updateOccupants = (
  firmwareVersion: string,
  sensorId: string,
  occupants: number,
  radarState: number,
  pirState: boolean
) => {
  let point = new Point('sensors')
    .tag('firmwareVersion', firmwareVersion)
    .tag('sensorId', sensorId)
    .intField('occupants', occupants)
    .intField('radarState', radarState)
    .booleanField('pirState', pirState);

  writeClient.writePoint(point);
  writeClient.flush();
};

export const getOccupants = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> last()`;
  return convertResults(await queryApi.collectRows(query));
};

export const getOccupantsHistory = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")`;
  return convertResults(await queryApi.collectRows(query));
};

export const getLastPIRChange = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "liveinfo")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_field"] == "sensorId" or r["_field"] == "pirState")
  |> filter(fn: (r) => r["_value"] == true)
  |> group(columns: ["sensorId"])
  |> last()`;
  return convertResults(await queryApi.collectRows(query));
};

export const getDeadSensors = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `import "influxdata/influxdb/monitor"
  import "date"
  
  from(bucket: "liveinfo")
    |> range(start: -1h)
    |> filter(fn: (r) => r["_field"] == "sensorId" or r["_field"] == "pirState")
    |> filter(fn: (r) => r["_measurement"] == "sensors")
    |> filter(fn: (r) => r["_value"] == true)
    |> group(columns: ["sensorId"])
    |> last()`;
  return await queryApi.collectRows(query);
};
