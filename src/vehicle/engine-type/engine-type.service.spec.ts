import { Test, TestingModule } from '@nestjs/testing';
import { EngineTypeService } from './engine-type.service';

describe('EngineTypeService', () => {
  let service: EngineTypeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EngineTypeService],
    }).compile();

    service = module.get<EngineTypeService>(EngineTypeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
