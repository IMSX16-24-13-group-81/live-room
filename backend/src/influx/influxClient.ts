import { InfluxDB } from '@influxdata/influxdb-client';

const token = process.env.INFLUXDB_TOKEN || '';
const url = process.env.INFLUXDB_URL || 'http://localhost:8086';

const influxClient = new InfluxDB({ url, token });

export default influxClient;
