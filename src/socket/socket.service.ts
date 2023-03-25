import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { PlayerData, TeleportData } from 'src/interfaces';

@Injectable()
export class SocketService {
  constructor(private prisma: PrismaService) {}

  async savePositionRotationMap(data: PlayerData) {
    const user = this.prisma.user.update({
      where: { id: data.userId },
      data: {
        lastRoom: data.room,
        lastPosition: {
          update: {
            x: data.position.x,
            y: data.position.y,
            z: data.position.z,
          },
        },
        lastRotation: {
          update: {
            w: data.rotation.w,
            x: data.rotation.x,
            y: data.rotation.y,
            z: data.rotation.z,
          },
        },
      },
    });
    return user;
  }

  async findTeleportsByRoomName(roomName: string) {
    const teleports: TeleportData[] = (
      await this.prisma.teleport.findMany({
        where: { fromRoomName: roomName },
      })
    ).map((data) => ({
      id: data.id,
      fromPosition: { x: data.fromX, y: data.fromY, z: data.fromZ },
    }));

    return teleports;
  }

  async findTeleportById(id: string) {
    const teleport = await this.prisma.teleport.findUnique({ where: { id } });
    return teleport;
  }
}
