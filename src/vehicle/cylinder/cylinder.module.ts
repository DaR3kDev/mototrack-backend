import { Module } from '@nestjs/common';
import { CylinderService } from './cylinder.service';
import { CylinderController } from './cylinder.controller';

@Module({
  controllers: [CylinderController],
  providers: [CylinderService],
})
export class CylinderModule {}
