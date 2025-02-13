import { BadRequestException, Body, Controller, Post } from '@nestjs/common';
import { z } from 'zod';
import { NotificationService } from './notifications.service';

// Define webhook schema
const WebhookSchema = z.object({
  externalId: z.string(),
  event: z.enum(['processing', 'rejected', 'sent', 'delivered', 'viewed']),
});

@Controller('webhooks')
export class NotificationWebhookController {
  constructor(private readonly notificationService: NotificationService) {}

  @Post()
  async handleWebhook(@Body() payload: any) {
    const parsed = WebhookSchema.safeParse(payload);
    if (!parsed.success) {
      throw new BadRequestException(parsed.error.errors);
    }

    return await this.notificationService.updateStatus(
      parsed.data.externalId,
      parsed.data.event,
    );
  }
}
