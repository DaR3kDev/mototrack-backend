import { Test, TestingModule } from '@nestjs/testing';
import { EngineTypeController } from './engine-type.controller';
import { EngineTypeService } from './engine-type.service';

describe('EngineTypeController', () => {
  let controller: EngineTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EngineTypeController],
      providers: [EngineTypeService],
    }).compile();

    controller = module.get<EngineTypeController>(EngineTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
