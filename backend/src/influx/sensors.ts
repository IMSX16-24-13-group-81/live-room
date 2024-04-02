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

const updateOccupants = (
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

const getOccupants = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> last()`;
  return convertResults(await queryApi.collectRows(query));
};

const getOccupantsHistory = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")`;
  return convertResults(await queryApi.collectRows(query));
};

const getLastOccupantsChange = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> monitor.stateChanges()
  |> last()`;
  return convertResults(await queryApi.collectRows(query));
};

export { getOccupants, getOccupantsHistory, updateOccupants, getLastOccupantsChange };
