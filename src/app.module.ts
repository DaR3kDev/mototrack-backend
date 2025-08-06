import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DocumentTypeModule } from './document-type/document-type.module';

@Module({
  imports: [DatabaseModule, UsersModule, DocumentTypeModule],
})
export class AppModule {}
