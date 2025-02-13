import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { NotificationModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    NotificationModule,
    ClientsModule.register([
      {
        name: 'KAFKA_SERVICE',
        transport: Transport.KAFKA,
        options: {
          client: {
            brokers: ['localhost:9092'], // Replace with actual Kafka broker address
          },
          consumer: {
            groupId: 'notification-service-group',
          },
        },
      },
    ]),
  ],
})
export class AppModule {}
