import { Module } from '@nestjs/common';

import { KafkaModule } from './modules/kafka/kafka.module';
import { NotificationModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    KafkaModule, // ✅ Register Kafka Module
    NotificationModule,
  ],
})
export class AppModule {}
