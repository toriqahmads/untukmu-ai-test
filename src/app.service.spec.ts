import { Test, TestingModule } from '@nestjs/testing';
import { AppService } from './app.service';

describe('AppService', () => {
  let service: AppService;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [],
      providers: [AppService],
    }).compile();

    service = app.get<AppService>(AppService);
  });

  describe('get', () => {
    it('should return "OK"', () => {
      expect(service.get()).toBe('OK');
    });
  });
});
