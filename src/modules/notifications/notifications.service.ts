import { Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notifications, NotificationSchema } from '../../database/schema';
import { KafkaService } from '../kafka/kafka.service';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(private readonly kafkaService: KafkaService) {} // ✅ Inject KafkaService

  async sendNotification(data: any) {
    try {
      const parsedData = NotificationSchema.omit({ id: true, timestamp: true })
        .extend({
          status: NotificationSchema.shape.status.default('processing'),
        })
        .safeParse(data);

      if (!parsedData.success) {
        this.logger.warn(`Validation failed: ${JSON.stringify(data)}`);
        throw new Error('Invalid notification data');
      }

      const id = (Math.random() + 1).toString(36).substring(7);
      await db.insert(notifications).values({ id, ...parsedData.data });

      this.logger.log(
        `Notification created: ID=${id}, External ID=${parsedData.data.externalId}`,
      );

      // ✅ Publish to Kafka
      this.kafkaService.publishStatusChange(
        parsedData.data.externalId,
        'processing',
      );

      return { id, ...parsedData.data };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to send notification: ${err.message}`);
      throw error;
    }
  }

  async updateStatus(
    externalId: string,
    status: string,
    timestamp: string | null,
  ) {
    try {
      if (!NotificationSchema.shape.status.safeParse(status).success) {
        this.logger.warn(
          `Invalid status update: ${status} for externalId: ${externalId}`,
        );
        throw new Error('Invalid status');
      }

      await db
        .update(notifications)
        .set({ status, timestamp })
        .where(eq(notifications.externalId, externalId));

      this.logger.log(
        `Status updated: External ID=${externalId}, New Status=${status}`,
      );

      // ✅ Publish to Kafka
      this.kafkaService.publishStatusChange(externalId, status);

      return { externalId, status };
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to update status: ${err.message}`);
      throw error;
    }
  }

  async getNotificationStatus(externalId: string) {
    try {
      const notification = await db
        .select()
        .from(notifications)
        .where(eq(notifications.externalId, externalId))
        .limit(1)
        .execute();

      if (!notification.length) {
        this.logger.warn(`Notification not found: External ID=${externalId}`);
        throw new Error('Notification not found');
      }

      return notification[0];
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Failed to get notification status: ${err.message}`);
      throw error;
    }
  }
}
