import { Body, Controller, Inject, Logger, Post } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { z } from 'zod';
import { NotificationService } from './notifications.service';

// Define webhook schema
const WebhookSchema = z.object({
  externalId: z.string(),
  event: z.enum(['processing', 'rejected', 'sent', 'delivered', 'viewed']),
  timestamp: z.string(),
});

@Controller('webhooks')
export class NotificationWebhookController {
  private readonly logger = new Logger(NotificationWebhookController.name);

  constructor(
    private readonly notificationService: NotificationService,
    @Inject('KAFKA_SERVICE') private readonly kafkaClient: ClientKafka,
  ) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    this.logger.log(`Received webhook: ${JSON.stringify(payload)}`);

    const parsed = WebhookSchema.safeParse(payload);
    if (!parsed.success) {
      this.logger.warn(`Invalid webhook payload: ${JSON.stringify(payload)}`);
      return;
    }

    try {
      // Update status in database
      const result = await this.notificationService.updateStatus(
        parsed.data.externalId,
        parsed.data.event,
        parsed.data.timestamp,
      );

      // ✅ Publish event to Kafka
      this.kafkaClient.emit('notification.status.change', {
        externalId: parsed.data.externalId,
        status: parsed.data.event,
        timestamp: new Date().toISOString(),
      });

      return result;
    } catch (error) {
      const err = error as Error;
      this.logger.error(`Error processing webhook: ${err.message}`);
      throw error;
    }
  }
}
