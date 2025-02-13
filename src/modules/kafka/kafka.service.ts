import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { KAFKA_TOPICS } from './kafka.constants';

@Injectable()
export class KafkaService {
  private readonly logger = new Logger(KafkaService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  publishStatusChange(externalId: string, status: string) {
    const event = {
      externalId,
      status,
      timestamp: new Date().toISOString(),
    };

    this.logger.log(`Publishing event: ${JSON.stringify(event)}`);

    this.kafkaClient.emit(KAFKA_TOPICS.STATUS_CHANGE, event);
  }
}
