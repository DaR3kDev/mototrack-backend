import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.municipalityService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.municipalityService.findOne(id);
  }
}
