import { Test, TestingModule } from '@nestjs/testing';
import { CylinderController } from './cylinder.controller';
import { CylinderService } from './cylinder.service';

describe('CylinderController', () => {
  let controller: CylinderController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CylinderController],
      providers: [CylinderService],
    }).compile();

    controller = module.get<CylinderController>(CylinderController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
