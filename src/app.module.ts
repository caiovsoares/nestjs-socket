import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SianGateway } from './sian/sian.gateway';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SianGateway],
})
export class AppModule {}
