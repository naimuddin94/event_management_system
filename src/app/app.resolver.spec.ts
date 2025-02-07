import { Test, TestingModule } from '@nestjs/testing';
import { AppResolver } from './app.resolver';
import { AppService } from './app.service';

describe('AppResolver', () => {
  let appController: AppResolver;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      providers: [AppService, AppResolver],
    }).compile();

    appController = app.get<AppResolver>(AppResolver);
  });

  describe('root', () => {
    it('should be able to test return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
