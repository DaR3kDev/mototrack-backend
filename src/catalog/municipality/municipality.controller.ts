import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { MunicipalityService } from './municipality.service';

@Controller('municipality')
export class MunicipalityController {
  constructor(private readonly municipalityService: MunicipalityService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.municipalityService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findOne(@Param('id') id: string) {
    return this.municipalityService.findOne(id);
  }
}
