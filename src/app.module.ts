import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { NotificationModule } from './modules/notifications/notifications.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // Load environment variables
    NotificationModule, // Import Notification module
  ],
})
export class AppModule {}
