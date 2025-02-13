import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from './kafka.constants';

@Injectable()
export class KafkaConsumerService implements OnModuleInit {
  private readonly logger = new Logger(KafkaConsumerService.name);

  constructor(private readonly kafkaClient: ClientKafka) {}

  async onModuleInit() {
    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.STATUS_CHANGE);

    await this.kafkaClient.connect();

    this.kafkaClient.subscribeToResponseOf(KAFKA_TOPICS.STATUS_CHANGE);

    this.kafkaClient.on(
      'message',
      (message: { topic: string; value: string }) => {
        if (message.topic === KAFKA_TOPICS.STATUS_CHANGE) {
          this.logger.log(
            `Received Kafka Event: ${JSON.stringify(message.value)}`,
          );

          // Process the notification update
          // Example: Send an email, update analytics, or trigger another system action
        }
      },
    );
  }
}
