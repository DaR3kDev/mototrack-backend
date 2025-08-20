import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MotorcycleService } from './motorcycle.service';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';

@Controller('vehicle/motorcycle')
export class MotorcycleController {
  constructor(private readonly motorcycleService: MotorcycleService) {}

  @Post()
  create(@Body() createMotorcycleDto: CreateMotorcycleDto) {
    return this.motorcycleService.create(createMotorcycleDto);
  }

  @Get()
  findAll() {
    return this.motorcycleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motorcycleService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMotorcycleDto: UpdateMotorcycleDto) {
    return this.motorcycleService.update(+id, updateMotorcycleDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motorcycleService.remove(+id);
  }
}
