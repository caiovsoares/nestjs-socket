import {
  ConnectedSocket,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';
import { MessageBody } from '@nestjs/websockets/decorators';
import { Socket } from 'socket.io';

@WebSocketGateway()
export class SianGateway {
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
  ping(@ConnectedSocket() client: Socket) {
    console.log('ping');
    client.emit('pong', 'pong');
  }
}
