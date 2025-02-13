import { Test, TestingModule } from '@nestjs/testing';
import { NotificationService } from '../notifications.service';
import { NotificationWebhookController } from '../webhook.controller';

describe('NotificationWebhookController', () => {
  let controller: NotificationWebhookController;
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NotificationWebhookController],
      providers: [
        {
          provide: NotificationService,
          useValue: {
            updateStatus: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<NotificationWebhookController>(
      NotificationWebhookController,
    );
    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should handle webhook updates', async () => {
    const mockRequest = {
      externalId: 'notif-123',
      event: 'delivered',
    };

    const mockResponse = { externalId: 'notif-123', status: 'delivered' };

    jest.spyOn(service, 'updateStatus').mockResolvedValueOnce(mockResponse);

    const result = await controller.handleWebhook(mockRequest);

    expect(result).toEqual(mockResponse);
    expect(service.updateStatus as jest.Mock).toHaveBeenCalledWith(
      'notif-123',
      'delivered',
    );
  });
});
