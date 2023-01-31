import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
} from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets/decorators';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SianGateway implements OnGatewayConnection {
  players = [];

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() data: string,
    @ConnectedSocket() client: Socket,
  ): Promise<string> {
    const a = JSON.parse(data);
    client.emit('message', JSON.stringify(a));
    return 'Hello world!';
  }

  @SubscribeMessage('ping')
  ping(@ConnectedSocket() client: Socket, @MessageBody() data: string) {
    client.emit('pong', 'pong');
  }

  handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.players.push({ x: 1, y: 2, z: 3 });
    console.log(`Servidor recebeu conexão com ID: ${client.id}`);
  }
}
