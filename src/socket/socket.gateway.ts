import { JwtService } from '@nestjs/jwt';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Socket, Server } from 'socket.io';
import {
  Message,
  MessageData,
  MovePlayerData,
  PlayerData,
  UserData,
} from 'src/interfaces';
import { SocketService } from './socket.service';

@WebSocketGateway()
export class SocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
  constructor(
    private readonly socketService: SocketService,
    private readonly jwtService: JwtService,
  ) {}

  @WebSocketServer()
  server: Server;

  private players = new Map<string, PlayerData>();

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: Socket) {
    client.emit('pong', 'pong');
  }

  @SubscribeMessage('enterGame')
  enterGame(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const { id, nick, lastPosition, lastRoom, lastRotation }: UserData =
      this.jwtService.verify(data, {
        secret: process.env.JWT_SECRET,
      }) as UserData;
    const room = lastRoom || 'Game';
    const position = lastPosition || { x: 0, y: 0, z: 0 };
    const rotation = lastRotation || { w: 0, x: 0, y: 0, z: 0 };
    if (this.players.get(client.id)) return; //TODO - PLAYER JA CONECTADO
    this.players.set(client.id, {
      socketId: client.id,
      userId: id,
      nick,
      room,
      position,
      rotation,
    });

    client.join(room);
    client
      .to(room)
      .emit('newPlayerConnected', JSON.stringify(this.players.get(client.id)));
    client.emit('teleport', room);

    console.clear();
    console.log(`Servidor recebeu conexão com ID: ${client.id}`);
    console.log(`Players conectados: `);
    this.players.forEach((player) => console.log(player.socketId));
  }

  @SubscribeMessage('sendRoomInfo')
  async sendRoomInfo(@ConnectedSocket() client: Socket) {
    const room = this.players.get(client.id).room;
    const playerIdSet = this.server.of('/').adapter.rooms.get(room);
    const playerIdList = Array.from(playerIdSet || []);
    const players = playerIdList.map((playerId) => this.players.get(playerId));
    const teleports = await this.socketService.findTeleportsByRoomName(room);
    client.emit('spawnAllPlayers', JSON.stringify(players));
    client.emit('spawnAllTeleports', JSON.stringify(teleports));
  }

  @SubscribeMessage('teleportRequest')
  async teleportRequest(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: string,
  ) {
    const teleport = await this.socketService.findTeleportById(data);
    const player = this.players.get(client.id);
    if (teleport.fromRoomName == player.room) {
      this.players.get(client.id).room = teleport.toRoomName;
      this.players.get(client.id).position = {
        x: teleport.toX,
        y: teleport.toY,
        z: teleport.toZ,
      };
      client.leave(teleport.fromRoomName);
      client.join(teleport.toRoomName);
      client.to(teleport.fromRoomName).emit('otherPlayerLeavedRoom', client.id);
      client
        .to(teleport.toRoomName)
        .emit(
          'newPlayerConnected',
          JSON.stringify(this.players.get(client.id)),
        );
      client.emit('teleport', teleport.toRoomName);
    }
  }

  @SubscribeMessage('movePlayer')
  move(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const movePlayerData: MovePlayerData = JSON.parse(data);
    client.to(this.players.get(client.id).room).emit('movePlayer', data);
    this.players.get(client.id).position = movePlayerData.position;
    this.players.get(client.id).rotation = movePlayerData.rotation;
  }

  @SubscribeMessage('updateRoom')
  updateRoom(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const playerData: PlayerData = JSON.parse(data);
    const playerIdList = Array.from(
      this.server.of('/').adapter.rooms.get(playerData.room) || [],
    );
    client
      .to(this.players.get(client.id).room)
      .emit('otherPlayerLeavedRoom', client.id);
    client.leave(this.players.get(client.id).room);
    client.join(playerData.room);
    client.to(Array.from(client.rooms)).emit('newPlayerConnected', data);
    client.emit(
      'spawnAllPlayers',
      JSON.stringify(
        playerIdList.map((playerId) => this.players.get(playerId)),
      ),
    );
  }

  @SubscribeMessage('newMessage')
  newMessage(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    const messageData: MessageData = JSON.parse(data);
    const player: PlayerData = this.players.get(client.id);
    messageData.sender = player.nick;
    messageData.senderId = player.socketId;
    if (messageData.messageType === Message.room)
      this.server
        .to(player.room)
        .emit('newMessage', JSON.stringify(messageData));
    else if (messageData.messageType === Message.global)
      this.server.emit('newMessage', JSON.stringify(messageData));
  }

  handleConnection(@ConnectedSocket() client: Socket) {
    client.join(client.id);
  }

  handleDisconnect(client: Socket) {
    const playerData = this.players.get(client.id);
    this.players.delete(client.id);
    client.to(playerData.room).emit('otherPlayerDisconnected', client.id);
    this.socketService.savePositionRotationMap(playerData);
    console.clear();
    console.log(`Servidor perdeu conexão com ID: ${client.id}`);
    console.log(`Players conectados: `);
    this.players.forEach((player) => console.log(player.socketId));
  }
}
