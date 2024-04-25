import { getPG } from '../db/config';
import { buildings, rooms, sensors } from '../db/schema';
import { eq } from 'drizzle-orm';
import { PirSensorState, RoomStatus, SimplifiedRoomState } from '../types';
import { getPIRStates, getOccupantsHistory } from '../influx/sensors';

type DatabaseRooms = Awaited<ReturnType<typeof getRooms>>;

type RoomSensorState = {
  sensor?: PirSensorState;
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

const mergeSensorRooms = (rooms: DatabaseRooms, sensors: PirSensorState[]) => {
  return rooms.map((r) => {
    const sensor = sensors.find((s) => s.sensorId === r.sensors.id);
    return { sensor, room: r.rooms, building: r.buildings };
  });
};

const determineRoomsState = (
  rooms: RoomSensorState[]
): SimplifiedRoomState[] => {
  return rooms.map((r) => {
    const state = r.sensor
      ? r.sensor.state
        ? RoomStatus.Occupied
        : RoomStatus.Empty
      : RoomStatus.Unknown;

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

const getRoomsStatus = async (buildingId?: string) => {
  const rooms = await getRooms();
  const sensorStatus = await getPIRStates();
  const buildingRooms = buildingId
    ? rooms.filter((room) => room.buildings.id.toString() === buildingId)
    : rooms;

  return sortState(
    determineRoomsState(mergeSensorRooms(buildingRooms, sensorStatus))
  );
};

const sortState = (rooms: SimplifiedRoomState[]) => {
  return rooms.sort((a, b) => {
    const stateNum = -(a.state - b.state);
    return stateNum == 0 ? a.name.localeCompare(b.name) : stateNum;
  });
};

const getRoomStatusHistory = async (
  roomId: string
): Promise<{ time: number; y: number }[]> => {
  const rooms = await getRooms();
  const room = rooms.find((room) => room.rooms.id.toString() === roomId);
  if (!room) return [];

  const sensorStatusHistory = await getOccupantsHistory(room.sensors.id);
  return sensorStatusHistory.map((s) => {
    return { time: new Date(s.reportedAt).getTime(), y: s.state };
  });
};

export { getRooms, getRoomsStatus, getRoomStatusHistory };
