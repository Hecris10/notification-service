import { Module, forwardRef } from '@nestjs/common';
import { KafkaModule } from '../kafka/kafka.module';
import { NotificationController } from './notifications.controller';
import { NotificationService } from './notifications.service';

@Module({
  imports: [forwardRef(() => KafkaModule)], // Use forwardRef to break circular dependency
  providers: [NotificationService],
  controllers: [NotificationController],
  exports: [NotificationService],
})
export class NotificationModule {}
