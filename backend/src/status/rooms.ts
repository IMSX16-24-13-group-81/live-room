import { getPG } from '../db/config';
import { buildings, rooms, sensors } from '../db/schema';
import { eq } from 'drizzle-orm';
import { RoomStatus, SensorState, SimplifiedRoomState } from '../types';
import {
  getDeadSensors,
  getLastPIRChange,
  getOccupantsHistory
} from '../influx/sensors';

type RoomSensorState<T> = SensorState<T> & {
  room: {
    id: number;
    name: string | null;
    description: string | null;
    coordiates: string | null;
  };
  building: {
    id: number;
  };
};

const mergeSensorRooms = <T>(
  rooms: Awaited<ReturnType<typeof getRooms>>,
  sensors: SensorState<T>[]
) => {
  return rooms.reduce((acc: RoomSensorState<T>[], room: (typeof rooms)[0]) => {
    const sensor = sensors.find(
      (sensor) => sensor.sensorId === room.sensors.id
    );

    if (!sensor) return acc;
    acc.push({ ...sensor, room: room.rooms, building: room.buildings });
    return acc;
  }, []);
};

const determineRoomsState = (
  rooms: RoomSensorState<boolean | number>[],
  deadSensors: string[] = []
): SimplifiedRoomState[] => {
  return rooms.map((r) => {
    const state = deadSensors.includes(r.sensorId)
      ? RoomStatus.Unknown
      : r.state || r.reportedAt.getTime() > Date.now() - 1000 * 60 * 10
        ? RoomStatus.Occupied
        : RoomStatus.Empty;

    return {
      id: r.room.id.toString(),
      buildingId: r.building?.id.toString(),
      name: r.room.name ?? '',
      description: r.room.description ?? '',
      state
    };
  });
};

const getRooms = async () => {
  const pg = await getPG();
  return await pg
    .select()
    .from(rooms)
    .innerJoin(sensors, eq(sensors.room, rooms.id))
    .innerJoin(buildings, eq(rooms.building, buildings.id));
};

const getRoomsStatus = async () => {
  const rooms = await getRooms();
  const sensorStatus = await getLastPIRChange();
  return determineRoomsState(mergeSensorRooms<boolean>(rooms, sensorStatus));
};

const getBuildingRoomsStatus = async (buildingId: string) => {
  const rooms = await getRooms();
  const sensorStatus = await getLastPIRChange();
  const buildingRooms = rooms.filter(
    (room) => room.buildings.id.toString() === buildingId
  );

  return determineRoomsState(
    mergeSensorRooms(buildingRooms, sensorStatus),
    await getDeadSensors()
  );
};

const getRoomStatusHistory = async (
  roomId: string
): Promise<{ time: number; y: number }[]> => {
  const rooms = await getRooms();
  const sensorStatusHistory = await getOccupantsHistory();
  const room = rooms.find((room) => room.rooms.id.toString() === roomId);
  if (!room) return [];

  const sensor = sensorStatusHistory.filter(
    (sensor) => sensor.sensorId === room.sensors.id
  );
  console.log(sensorStatusHistory);

  return sensor.map((s) => {
    return { time: new Date(s.reportedAt).getTime(), y: s.state };
  });
};

export {
  getRooms,
  getRoomsStatus,
  getBuildingRoomsStatus,
  getRoomStatusHistory
};
