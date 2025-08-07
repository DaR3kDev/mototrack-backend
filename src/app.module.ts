import { Module } from '@nestjs/common';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { DocumentTypeModule } from './document-type/document-type.module';
import { DepartmentModule } from './deparment/department.module';
import { MunicipalityModule } from './municipality/municipality.module';

@Module({
  imports: [DatabaseModule, UsersModule, DocumentTypeModule, DepartmentModule, MunicipalityModule],
})
export class AppModule {}
