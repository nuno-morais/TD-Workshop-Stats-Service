import { Module } from '@nestjs/common';
import { AmqpModule } from 'nestjs-amqp';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';
import 'dotenv/config';
import { StatsConsumer } from './stats.consumer';

@Module({
  imports: [
    AmqpModule.forRoot({
      name: 'rabbitmq',
      port: process.env.AMQP_PORT || 5673,
      hostname: process.env.AMQP_HOST || 'localhost',
      username: process.env.USERNAME || 'test',
      password: process.env.PASSWORD || 'test',
    } as any),
  ],
  controllers: [StatsController],
  providers: [StatsService, StatsConsumer],
})
export class AppModule {
}
