import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';

@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.documentTypeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.documentTypeService.findOne(id);
  }
}
