import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DocumentTypeService } from './document-type.service';

@Controller('document-type')
export class DocumentTypeController {
  constructor(private readonly documentTypeService: DocumentTypeService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.documentTypeService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.documentTypeService.findOne(id);
  }
}
