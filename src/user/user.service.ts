import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/database/prisma.service';
import { CreateUserDTO } from './user.dto';
import * as bcrypt from 'bcrypt';
import { UserData } from 'src/interfaces';

const saltRounds = 10;

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserDTO) {
    const { login, password, nick } = data;

    try {
      const hash = await bcrypt.hash(password, saltRounds);
      const user = await this.prisma.user.create({
        data: {
          login,
          password: hash,
          nick,
          lastRoom: 'Game',
          lastPosition: { create: { x: 0, y: 0.5, z: 0 } },
          lastRotation: { create: { w: 0, x: 0, y: 0, z: 0 } },
        },
        include: { lastPosition: true, lastRotation: true },
      });

      const userData: UserData = {
        id: user.id,
        login: user.login,
        nick: user.nick,
        lastRoom: user.lastRoom,
        lastPosition: user.lastPosition,
        lastRotation: user.lastRotation,
      };

      return userData;
    } catch (error) {
      throw new HttpException(error, 400);
    }
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    return users;
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: { lastPosition: true, lastRotation: true },
    });

    const userData: UserData = {
      id: user.id,
      login: user.login,
      nick: user.nick,
      lastRoom: user.lastRoom,
      lastPosition: user.lastPosition,
      lastRotation: user.lastRotation,
    };

    return userData;
  }

  async findOneAuth(login: string) {
    const user = await this.prisma.user.findUnique({
      where: { login },
      include: { lastPosition: true, lastRotation: true },
    });
    return user;
  }
}
