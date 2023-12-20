import { Test, TestingModule } from '@nestjs/testing';
import { TelegrafController } from './telegraf.controller';
import { TelegrafService } from './telegraf.service';

describe('TelegrafController', () => {
  let controller: TelegrafController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TelegrafController],
      providers: [TelegrafService],
    }).compile();

    controller = module.get<TelegrafController>(TelegrafController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
