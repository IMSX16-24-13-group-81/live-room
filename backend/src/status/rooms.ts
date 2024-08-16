import { getPG } from '../db/config';
import { buildings, rooms, sensors, bigrooms } from '../db/schema';
import { eq } from 'drizzle-orm';
import { PirSensorState, RoomStatus, SimplifiedRoomState } from '../types';
import { getPIRStates, getOccupantsHistory, getOccupants } from '../influx/sensors';

type DatabaseRooms = Awaited<ReturnType<typeof getRooms>>;

type RoomSensorState = {
  sensor?: PirSensorState;
  room: {
    id: number;
    name: string | null;
    description: string | null;
    coordinates: string | null;
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

const addRoom = async (name: string, coordinates: string, building: number, description: string) => {
  const db = await getPG();
  return await db
    .insert(rooms).values({
    name: name, 
    coordinates: coordinates, 
    building: building,
    description: description
  });  
};

const addBigRoom = async (id: number, name: string, building: number, places: number, description: string, coordinates: string) => {
  const db = await getPG();
  return await db 
    .insert(bigrooms).values({
    id: id,
    name: name,
    building: building,
    places: places,
    description: description,
    coordinates: coordinates
  });
};

export const findBuilding = async (building : number) => {
  const db = await getPG();
  const result = await db
    .select()
    .from(buildings)
    .where(eq(buildings.id, building))
    .limit(1);
  if (result.length > 0) {
      return result[0]; // Return the building object if found
  } else {  
      return null; // Return null if no building was found
  }
};

export const findRoom = async (roomId: number) => {
  const db = await getPG();
  const result = await db
    .select()
    .from(rooms)
    .where(eq(rooms.id, roomId))
    .limit(1);
  if (result.length > 0) {
      return result[0]; // Return the room object if found
  } else {
      return null; // Return null if no room was found
  }
}

const addSensors = async (sensorId: string, roomId: number) => {
  const db = await getPG();
  return await db
    .insert(sensors).values({
    id: sensorId, 
    room: roomId
    });
}

export const findSensor = async (sensorId: string) => {
  const db = await getPG();
  const result = await db
    .select()
    .from(sensors)
    .where(eq(sensors.id, sensorId))
    .limit(1);
  if (result.length > 0) {
      return result[0]; // Return the sensor object if found
  } else {
      return null; // Return null if no sensor was found
  }
}

export const deleteSensors = async (sensorId: string) => { 
  const db = await getPG();
  return await db
    .delete(sensors)
    .where(eq(sensors.id, sensorId));
}

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

export { getRooms, getRoomsStatus, getRoomStatusHistory, addRoom, addSensors };
