import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { EngineTypeService } from './engine-type.service';
import { CreateEngineTypeDto } from './dto/create-engine-type.dto';
import { UpdateEngineTypeDto } from './dto/update-engine-type.dto';

@Controller('engine-type')
export class EngineTypeController {
  constructor(private readonly engineTypeService: EngineTypeService) {}

  @Post()
  create(@Body() createEngineTypeDto: CreateEngineTypeDto) {
    return this.engineTypeService.create(createEngineTypeDto);
  }

  @Get()
  findAll() {
    return this.engineTypeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.engineTypeService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateEngineTypeDto: UpdateEngineTypeDto) {
    return this.engineTypeService.update(+id, updateEngineTypeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.engineTypeService.remove(+id);
  }
}
