import { Inject, Injectable, Logger } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notifications, NotificationSchema } from '../../database/schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

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

      // ✅ Publish the event to Kafka
      this.kafkaClient.emit('notification.status.change', {
        externalId: parsedData.data.externalId,
        status: 'processing',
        timestamp: new Date().toISOString(),
      });

      return { id, ...parsedData.data };
    } catch (error: unknown) {
      const message = (error as Error).message;
      this.logger.error(`Failed to send notification: ${message}`);
      throw error;
    }
  }

  async updateStatus(externalId: string, status: string) {
    try {
      if (!NotificationSchema.shape.status.safeParse(status).success) {
        this.logger.warn(
          `Invalid status update: ${status} for externalId: ${externalId}`,
        );
        throw new Error('Invalid status');
      }

      await db
        .update(notifications)
        .set({ status })
        .where(eq(notifications.externalId, externalId));

      this.logger.log(
        `Status updated: External ID=${externalId}, New Status=${status}`,
      );

      // ✅ Publish the updated status to Kafka
      this.kafkaClient.emit('notification.status.change', {
        externalId,
        status,
        timestamp: new Date().toISOString(),
      });

      return { externalId, status };
    } catch (error: unknown) {
      const err = error as Error;
      this.logger.error(`Failed to update status: ${err.message}`);
      throw error;
    }
  }
}
