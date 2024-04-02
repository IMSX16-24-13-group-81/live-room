import { getPG } from '../db/config';
import { rooms, sensors } from '../db/schema';
import { eq } from 'drizzle-orm';
import { RoomStatus, SensorState, SimplifiedRoomState } from '../types';
import { getLastOccupantsChange } from '../influx/sensors';

type RoomSensorState = SensorState & {
  room: {
    id: number;
    name: string | null;
    coordiates: string | null;
  };
};

const mergeSensorRooms = (
  rooms: Awaited<ReturnType<typeof getRooms>>,
  sensors: SensorState[]
) => {
  return rooms.reduce((acc: RoomSensorState[], room: (typeof rooms)[0]) => {
    const sensor = sensors.find(
      (sensor) => sensor.sensorId === room.sensors.id
    );

    if (!sensor) return acc;
    acc.push({ ...sensor, room: room.rooms });
    return acc;
  }, []);
};

const determineRoomsState = (
  rooms: RoomSensorState[]
): SimplifiedRoomState[] => {
  return rooms.map((r) => {
    if (r.occupants === 0) {
      return {
        roomId: r.room.id.toString(),
        state: RoomStatus.Empty,
        occupants: r.occupants
      };
    } else if (r.occupants > 0) {
      return {
        roomId: r.room.id.toString(),
        state: RoomStatus.Occupied,
        occupants: r.occupants
      };
    } else {
      return {
        roomId: r.room.id.toString(),
        state: RoomStatus.Unknown,
        occupants: r.occupants
      };
    }
  });
};

const getRooms = async () => {
  const pg = await getPG();
  return await pg
    .select()
    .from(rooms)
    .innerJoin(sensors, eq(sensors.room, rooms.id));
};

const getRoomsStatus = async () => {
  const rooms = await getRooms();
  const sensorStatus = await getLastOccupantsChange();
  return determineRoomsState(mergeSensorRooms(rooms, sensorStatus));
};

export { getRooms, getRoomsStatus };
