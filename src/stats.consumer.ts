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
            const queue = 'system_stats';
            const channel = await this.amqp.createChannel();
            await channel.assertQueue(queue);
            Logger.debug(`Consuming: '${queue}'`);
            channel.consume(queue, (msg) => {
                Logger.debug(` [x] Received ${msg.content.toString()}`);
            }, { noAck: true });
        } catch (e) {
            Logger.error(e);
        }
    }
}
