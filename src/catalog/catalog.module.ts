import { Module } from '@nestjs/common';
import { DepartmentController } from './department/department.controller';
import { MunicipalityController } from './municipality/municipality.controller';
import { DocumentTypeController } from './document-type/document-type.controller';
import { DepartmentService } from './department/department.service';
import { MunicipalityService } from './municipality/municipality.service';
import { DocumentTypeService } from './document-type/document-type.service';

@Module({
  controllers: [DepartmentController, MunicipalityController, DocumentTypeController],
  providers: [DepartmentService, MunicipalityService, DocumentTypeService],
})
export class CatalogModule {}
