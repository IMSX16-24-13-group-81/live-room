import { Point } from '@influxdata/influxdb-client';
import influxClient from './influxClient';
import { SensorState } from '../types';

let org = process.env.INFLUXDB_ORG ?? `liveinfo`;
let bucket = process.env.INFLUXDB_BUCKET ?? `liveinfo`;

let writeClient = influxClient.getWriteApi(org, bucket, 'ns');

const convertResults = <T>(
  results: any[],
  field?: string
): SensorState<T>[] => {
  return results
    .filter(
      (row: any) =>
        row._field === (field ?? 'occupants') &&
        row.result === '_result' &&
        row._value !== undefined
    )
    .map((row: any) => {
      return {
        sensorId: row.sensorId,
        state: row._value as T,
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
  return convertResults<number>(await queryApi.collectRows(query));
};

export const getOccupantsHistory = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")`;
  return convertResults<number>(await queryApi.collectRows(query));
};

export const getLastPIRChange = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "liveinfo")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_field"] == "sensorId" or r["_field"] == "pirState")
  |> filter(fn: (r) => r["_value"] == true)
  |> group(columns: ["sensorId"])
  |> last()`;
  return convertResults<boolean>(await queryApi.collectRows(query), 'pirState');
};

export const getDeadSensors = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `import "influxdata/influxdb/monitor"
  import "date"
  
  from(bucket: "liveinfo")
    |> range(start: -1h)
    |> filter(fn: (r) => r["_field"] == "sensorId" or r["_field"] == "pirState")
    |> filter(fn: (r) => r["_measurement"] == "sensors")
    |> group(columns: ["sensorId"])
    |> monitor.deadman(t: date.add(d: -1h, to: now()))`;
  const res = await queryApi.collectRows(query);
  return res.filter((row: any) => row.dead).map((row: any) => row.sensorId);
};
