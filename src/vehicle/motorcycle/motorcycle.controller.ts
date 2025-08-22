import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { MotorcycleService } from './motorcycle.service';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { PaginationMotorCycleDto } from './dto/pagination-motorcycle.dto';

@Controller('vehicle/motorcycle')
export class MotorcycleController {
  constructor(private readonly motorcycleService: MotorcycleService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  create(@Body() dto: CreateMotorcycleDto) {
    return this.motorcycleService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  pagination(@Query() dto: PaginationMotorCycleDto) {
    return this.motorcycleService.pagination(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.motorcycleService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('plate/:licensePlate')
  findByPlate(@Param('licensePlate') plate: string) {
    return this.motorcycleService.findByPlate(plate);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  update(@Param('id') id: string, @Body() dto: UpdateMotorcycleDto) {
    return this.motorcycleService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.motorcycleService.remove(id);
  }
}
