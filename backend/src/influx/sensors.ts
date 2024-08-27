import { Point, flux } from '@influxdata/influxdb-client';
import influxClient from './influxClient';
import { SensorState } from '../types';

let org = process.env.INFLUXDB_ORG ?? `liveinfo`;
let bucket = process.env.INFLUXDB_BUCKET ?? `liveinfo`;

let writeClient = influxClient.getWriteApi(org, bucket, 'ns');

const convertResults = <T>(
  results: any[],
  field: string = 'occupants'
): SensorState<T>[] => {
  return results
    .filter(
      (row: any) =>
        row._field === field &&
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
  //roomName: string,
  occupants: number,
  radarState?: number,
  pirState?: boolean
) => {
  let point = new Point('sensors')
    .tag('firmwareVersion', firmwareVersion)
    .tag('sensorId', sensorId)
    //.tag('roomName', roomName)
    .intField('occupants', occupants)
    //.intField('radarState', radarState)
    //booleanField('pirState', pirState);
    
    if (typeof radarState === 'number') {
      point.intField('radarState', radarState);
    }
  
    // Add pirState only if it is defined
    if (typeof pirState === 'boolean') {
      point.booleanField('pirState', pirState);
    }

  writeClient.writePoint(point);
  writeClient.flush();
};

//Add so that we can choose intervall ourselves.
export const getOccupants = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = flux`from(bucket: "${bucket}")
  |> range(start: -1h)
  |> filter(fn: (r) => r._measurement == "sensors")
  |> last()`;
  return convertResults<number>(await queryApi.collectRows(query));
};

//Query for current and historical data for statistics
export const getOccupantsHistory = async (sensorId: string, startDateTime?: string, endDateTime?: string) => {
  let queryApi = influxClient.getQueryApi(org);

  // Constructing the range part of the query
  let rangeQuery = `|> range(start: ${startDateTime ? startDateTime : '-1h'}${endDateTime ? `, stop: ${endDateTime}` : ''})`;

  const query = flux`from(bucket: "${bucket}")
    ${rangeQuery}
    |> filter(fn: (r) => r._measurement == "sensors")
    |> filter(fn: (r) => r["sensorId"] == "${sensorId}")`;

  const results = await queryApi.collectRows(query);
  return convertResults<number>(await queryApi.collectRows(query));
};

export const getPIRStates = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "liveinfo")
  |> range(start: -10m)
  |> filter(fn: (r) => r["_field"] == "sensorId" or r["_field"] == "occupants")
  |> toInt()
  |> sum(column: "_value")
  |> map(fn: (r) => ({
      sensorId: r.sensorId,
      status: r._value >= 1.0
    }))`;
  const res = await queryApi.collectRows(query);
  return res.map((row: any) => {
    return { sensorId: row.sensorId, state: row.status };
  });
};

export const getTotalUsage = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `from(bucket: "liveinfo")
  |> range(start: -1d)
  |> filter(fn: (r) => r["_field"] == "pirState")
  |> toFloat()
  |> window(every: 1m, period: 10m)
  |> group(columns: ["_start", "sensorId"])
  |> max()
  |> group(columns: ["_start"], mode:"by")
  |> sum(column: "_value")
  |> map(fn: (r) => ({
      _time: r._start,
      _value: r._value
    }))`;
  return convertResults<number>(
    await queryApi.collectRows(query),
    'totalUsage'
  );
};

export const getDeadSensors = async () => {
  let queryApi = influxClient.getQueryApi(org);
  const query = `import "influxdata/influxdb/monitor"
  import "date"
  
  from(bucket: "liveinfo")
    |> range(start: -inf)
    |> filter(fn: (r) => (r["_field"] == "sensorId" or r["_field"] == "pirState") and r["_measurement"] == "sensors")
    |> group(columns: ["sensorId"])
    |> monitor.deadman(t: date.add(d: -1h, to: now()))`;
  const res = await queryApi.collectRows(query);
  return res.filter((row: any) => row.dead).map((row: any) => row.sensorId);
};
