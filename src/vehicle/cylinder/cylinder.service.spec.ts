import { Test, TestingModule } from '@nestjs/testing';
import { CylinderService } from './cylinder.service';

describe('CylinderService', () => {
  let service: CylinderService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CylinderService],
    }).compile();

    service = module.get<CylinderService>(CylinderService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
