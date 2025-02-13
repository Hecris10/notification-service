import { Test, TestingModule } from '@nestjs/testing';
import { db } from '../../../database/db';
import { NotificationService } from '../notifications.service';

jest.mock('../../../database/db', () => ({
  db: {
    insert: jest.fn(() => ({
      values: jest.fn().mockResolvedValue({}),
    })) as jest.Mock,
    update: jest.fn(() => ({
      set: jest.fn(() => ({
        where: jest.fn().mockResolvedValue({}),
      })),
    })) as jest.Mock,
    select: jest.fn(() => ({
      from: jest.fn(() => ({
        where: jest.fn(() => ({
          limit: jest.fn().mockResolvedValue([]),
        })),
      })),
    })) as jest.Mock,
  },
}));

describe('NotificationService', () => {
  let service: NotificationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NotificationService],
    }).compile();

    service = module.get<NotificationService>(NotificationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a notification', async () => {
    const mockData = {
      channel: 'sms',
      to: '+5511999999999',
      body: 'Hello!',
      externalId: 'test-123',
    };

    const result = await service.sendNotification(mockData);

    expect(result).toHaveProperty('id');
    expect(result.channel).toBe(mockData.channel);
    expect(result.status).toBe('processing');
  });

  it('should update notification status', async () => {
    const result = await service.updateStatus('test-123', 'delivered');

    expect(result).toEqual({ externalId: 'test-123', status: 'delivered' });
  });

  it('should retrieve notification status', async () => {
    const mockData = [
      {
        id: 'notif-1',
        externalId: 'test-123',
        channel: 'sms',
        to: '+5511999999999',
        body: 'Hello!',
        status: 'sent',
      },
    ];

    // Mock the return of the database query with correct typing
    jest.spyOn(db, 'select').mockReturnValue({
      from: jest.fn().mockReturnValue({
        where: jest.fn().mockReturnValue({
          limit: jest.fn().mockResolvedValue(mockData),
        }),
      }),
    } as unknown as ReturnType<typeof db.select>);

    const result = await service.getNotificationStatus('test-123');

    expect(result).toEqual(mockData);
  });
});
