import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notifications, NotificationSchema } from '../../database/schema';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);

  async sendNotification(data: any) {
    try {
      // Ensure `status` is set to "processing" by default
      const parsedData = NotificationSchema.omit({ id: true, timestamp: true })
        .extend({
          status: NotificationSchema.shape.status.default('processing'),
        })
        .safeParse(data);

      if (!parsedData.success) {
        this.logger.warn(`Validation failed: ${JSON.stringify(data)}`);
        throw new BadRequestException(parsedData.error.errors);
      }

      const id = (Math.random() + 1).toString(36).substring(7);
      await db.insert(notifications).values({ id, ...parsedData.data });

      this.logger.log(
        `Notification created successfully. ID: ${id}, External ID: ${parsedData.data.externalId}`,
      );
      return { id, ...parsedData.data };
    } catch (error: unknown) {
      const err = error as { message: string; stack: string };
      this.logger.error(
        `Failed to send notification: ${err.message}`,
        err.stack,
      );
      throw error;
    }
  }

  async updateStatus(externalId: string, status: string) {
    try {
      // Validate status
      if (!NotificationSchema.shape.status.safeParse(status).success) {
        this.logger.warn(
          `Invalid status update attempt: ${status} for externalId: ${externalId}`,
        );
        throw new BadRequestException('Invalid status');
      }

      await db
        .update(notifications)
        .set({ status })
        .where(eq(notifications.externalId, externalId));

      this.logger.log(
        `Status updated successfully: External ID: ${externalId}, New Status: ${status}`,
      );
      return { externalId, status };
    } catch (error: unknown) {
      const err = error as { message: string; stack: string };
      this.logger.error(`Failed to update status: ${err.message}`, err.stack);
      throw error;
    }
  }

  async getNotificationStatus(externalId: string) {
    try {
      const result = await db
        .select()
        .from(notifications)
        .where(eq(notifications.externalId, externalId))
        .limit(1);

      if (!result.length) {
        this.logger.warn(
          `No notification found for External ID: ${externalId}`,
        );
      } else {
        this.logger.log(
          `Fetched status for External ID: ${externalId}, Status: ${result[0].status}`,
        );
      }

      return result;
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
