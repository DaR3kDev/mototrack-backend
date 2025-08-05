import { Global, Module } from '@nestjs/common';
import { DatabaseService } from './database.services';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [DatabaseService],
})
export class DatabaseModule {}
