import { Body, Controller, Get, Logger, Post, Query } from '@nestjs/common';
import { NotificationService } from './notifications.service';

@Controller('notifications')
export class NotificationController {
  private readonly logger = new Logger(NotificationController.name);

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
    this.logger.log(
      `Received request to send notification: ${JSON.stringify(payload)}`,
    );
    try {
      const response = await this.notificationService.sendNotification(payload);
      this.logger.log(
        `Notification sent successfully. External ID: ${response.externalId}`,
      );
      return response;
    } catch (error: unknown) {
      const err = error as { message: string; stack: string };
      this.logger.error(
        `Failed to send notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  @Get()
  async getNotificationStatus(@Query('externalId') externalId: string) {
    this.logger.log(
      `Received request to fetch notification status for External ID: ${externalId}`,
    );
    try {
      const response =
        await this.notificationService.getNotificationStatus(externalId);
      this.logger.log(
        `Successfully retrieved status for External ID: ${externalId}`,
      );
      return response;
    } catch (error: unknown) {
      const err = error as { message: string; stack: string };
      this.logger.error(
        `Failed to retrieve notification status: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }
}
