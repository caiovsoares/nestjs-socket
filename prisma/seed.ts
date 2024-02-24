import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
const prisma = new PrismaClient();
const saltRounds = 10;

async function main() {
  let hash = 'a';
  hash = await bcrypt.hash('a', saltRounds);
  const sian = await prisma.user.create({
    data: {
      login: 'a',
      password: hash,
      nick: 'sian',
      lastRoom: 'Game',
      lastPosition: { create: { x: 0, y: 0, z: 0 } },
      lastRotation: { create: { w: 0, x: 0, y: 0, z: 0 } },
    },
  });
  hash = await bcrypt.hash('b', saltRounds);
  const b = await prisma.user.create({
    data: {
      login: 'b',
      password: hash,
      nick: 'b',
      lastRoom: 'Game',
      lastPosition: { create: { x: 0, y: 0, z: 0 } },
      lastRotation: { create: { w: 0, x: 0, y: 0, z: 0 } },
    },
  });
  hash = await bcrypt.hash('c', saltRounds);
  const c = await prisma.user.create({
    data: {
      login: 'c',
      password: hash,
      nick: 'c',
      lastRoom: 'Game',
      lastPosition: { create: { x: 0, y: 0, z: 0 } },
      lastRotation: { create: { w: 0, x: 0, y: 0, z: 0 } },
    },
  });
  hash = await bcrypt.hash('d', saltRounds);
  const d = await prisma.user.create({
    data: {
      login: 'd',
      password: hash,
      nick: 'd',
      lastRoom: 'Game',
      lastPosition: { create: { x: 0, y: 0, z: 0 } },
      lastRotation: { create: { w: 0, x: 0, y: 0, z: 0 } },
    },
  });

  const Game = await prisma.room.create({
    data: { name: 'Game', open: true },
  });
  const Game2 = await prisma.room.create({
    data: { name: 'Game2' },
  });
  const Game3 = await prisma.room.create({
    data: { name: 'Game3' },
  });

  const connection12 = await prisma.teleport.create({
    data: {
      roomFrom: { connect: { name: Game.name } },
      roomTo: { connect: { name: Game2.name } },
      fromX: 0,
      fromY: 0,
      fromZ: 25,
      toX: 0,
      toY: 0,
      toZ: -23,
    },
  });

  const connection21 = await prisma.teleport.create({
    data: {
      roomFrom: { connect: { name: Game2.name } },
      roomTo: { connect: { name: Game.name } },
      fromX: 0,
      fromY: 0,
      fromZ: -25,
      toX: 0,
      toY: 0,
      toZ: 23,
    },
  });

  const connection23 = await prisma.teleport.create({
    data: {
      roomFrom: { connect: { name: Game2.name } },
      roomTo: { connect: { name: Game3.name } },
      fromX: -25,
      fromY: 0,
      fromZ: 0,
      toX: 23,
      toY: 0,
      toZ: 0,
    },
  });

  const connection32 = await prisma.teleport.create({
    data: {
      roomFrom: { connect: { name: Game3.name } },
      roomTo: { connect: { name: Game2.name } },
      fromX: 25,
      fromY: 0,
      fromZ: 0,
      toX: -23,
      toY: 0,
      toZ: 0,
    },
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
