import { Module, forwardRef } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationModule } from '../notifications/notifications.module';
import { KafkaConsumerService } from './kafka.consumer';
import { KafkaService } from './kafka.service';

@Module({
  imports: [
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Update this if Kafka broker is on a different host/port
          },
          consumer: {
            groupId: 'notification-service-group',
          },
        },
      },
    ]),
    forwardRef(() => NotificationModule),
  ],
  providers: [KafkaService, KafkaConsumerService],
  exports: [KafkaService, ClientsModule],
})
export class KafkaModule {}
