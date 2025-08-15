import { Module } from '@nestjs/common';
import { EngineTypeService } from './engine-type.service';
import { EngineTypeController } from './engine-type.controller';

@Module({
  controllers: [EngineTypeController],
  providers: [EngineTypeService],
})
export class EngineTypeModule {}
