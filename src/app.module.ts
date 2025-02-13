import { Module } from '@nestjs/common';
import { KafkaModule } from './modules/kafka/kafka.module';
import { NotificationModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    KafkaModule, // ✅ Import KafkaModule to register KAFKA_SERVICE globally
    NotificationModule,
  ],
})
export class AppModule {}
