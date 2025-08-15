import { Module } from '@nestjs/common';
import { MotorcycleService } from './motorcycle.service';
import { MotorcycleController } from './motorcycle.controller';

@Module({
  controllers: [MotorcycleController],
  providers: [MotorcycleService],
})
export class MotorcycleModule {}
