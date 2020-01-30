import { Injectable, Logger } from '@nestjs/common';
import { InjectAmqpConnection } from 'nestjs-amqp';
import { StatsService } from './stats.service';

@Injectable()
export class StatsConsumer {
    constructor(
        @InjectAmqpConnection('rabbitmq') private readonly amqp,
        private readonly statsService: StatsService,
    ) {
        this.consume();
    }

    async consume() {
        try {
            const queue = 'stats';
            const channel = await this.amqp.createChannel();
            await channel.assertQueue(queue);
            Logger.debug(`Consuming: '${queue}'`);
            channel.consume(queue, (msg) => {
                Logger.debug(` [x] Received ${msg.content.toString()}`);
                try {
                    const event = JSON.parse(msg.content.toString());
                    if (event.name === 'updated') {
                        this.statsService.increaseUpdate(event.userId);
                    } else if (event.name === 'deleted') {
                        this.statsService.increaseDelete(event.userId);
                    } else if (event.name === 'created') {
                        this.statsService.increaseCreate(event.userId);
                    }
                    Logger.debug(this.statsService.get(event.userId));
                } catch (e) {
                    Logger.error(e);
                }

            }, { noAck: true });
        } catch (e) {
            Logger.error(e);
        }
    }
}
