import { BadRequestException, Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { db } from '../../database/db';
import { notifications, NotificationSchema } from '../../database/schema';

@Injectable()
export class NotificationService {
  async sendNotification(data: any) {
    // Ensure `status` is set to "processing" by default
    const parsedData = NotificationSchema.omit({ id: true, timestamp: true })
      .extend({ status: NotificationSchema.shape.status.default('processing') }) // Add default status
      .safeParse(data);

    if (!parsedData.success) {
      throw new BadRequestException(parsedData.error.errors);
    }

    const id = (Math.random() + 1).toString(36).substring(7);
    await db.insert(notifications).values({ id, ...parsedData.data });

    return { id, ...parsedData.data };
  }

  async updateStatus(externalId: string, status: string) {
    // Validate status
    if (!NotificationSchema.shape.status.safeParse(status).success) {
      throw new BadRequestException('Invalid status');
    }

    await db
      .update(notifications)
      .set({ status })
      .where(eq(notifications.externalId, externalId));
    return { externalId, status };
  }

  async getNotificationStatus(externalId: string) {
    return db
      .select()
      .from(notifications)
      .where(eq(notifications.externalId, externalId))
      .limit(1);
  }
}
