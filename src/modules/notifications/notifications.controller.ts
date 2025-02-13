import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async sendNotification(
    @Body()
    payload: {
      channel: string;
      to: string;
      body: string;
      externalId: string;
    },
  ) {
    return await this.notificationService.sendNotification(payload);
  }

  @Get()
  async getNotificationStatus(@Query('externalId') externalId: string) {
    return await this.notificationService.getNotificationStatus(externalId);
  }
}
