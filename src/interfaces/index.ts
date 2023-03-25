export type PlayerData = {
  socketId: string;
  userId?: string;
  nick?: string;
  room?: string;
  position?: Vector3;
  rotation?: Quaternion;
};

export type MovePlayerData = {
  socketId: string;
  position: Vector3;
  rotation: Quaternion;
};

export type UserData = {
  id: string;
  login: string;
  nick: string;
  lastRoom?: string;
  lastPosition?: Vector3;
  lastRotation?: Quaternion;
};

export type TeleportData = {
  id: string;
  fromPosition: Vector3;
};

export type Vector3 = {
  x: number;
  y: number;
  z: number;
};

export type Quaternion = {
  w: number;
  x: number;
  y: number;
  z: number;
};
