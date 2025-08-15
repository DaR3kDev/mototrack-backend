import { Test, TestingModule } from '@nestjs/testing';
import { MotorcycleController } from './motorcycle.controller';
import { MotorcycleService } from './motorcycle.service';

describe('MotorcycleController', () => {
  let controller: MotorcycleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MotorcycleController],
      providers: [MotorcycleService],
    }).compile();

    controller = module.get<MotorcycleController>(MotorcycleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
