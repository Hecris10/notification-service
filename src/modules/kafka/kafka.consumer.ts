import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { InferSelectModel } from 'drizzle-orm';
import { notifications } from '../../database/schema';
import { NotificationService } from '../notifications/notifications.service';
import { KAFKA_TOPICS } from './kafka.constants';

type Notification = InferSelectModel<typeof notifications>;

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
    private readonly notificationService: NotificationService,
  ) {}

  async onModuleInit() {
    // ✅ Subscribe to the Kafka topic
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.STATUS_CHANGE);

    await this.kafkaClient.connect();
  }

  async consumeMessages(message: { value: Notification; offset: string }) {
    try {
      this.logger.log(
        `Processing Kafka Event: ${JSON.stringify(message.value)}`,
      );

      // Process the event with inferred type
      await this.notificationService.updateStatus(
        message.value.externalId,
        message.value.status,
        message.value.timestamp,
      );

      this.logger.log(
        `Successfully processed Kafka event: ${message.value.externalId}`,
      );
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error processing Kafka event: ${err.message}`);
    }
  }
}
