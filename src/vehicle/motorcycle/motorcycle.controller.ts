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
  async create(@Body() dto: CreateMotorcycleDto) {
    return await this.motorcycleService.create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async pagination(@Query() dto: PaginationMotorCycleDto) {
    return await this.motorcycleService.pagination(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.motorcycleService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('plate/:licensePlate')
  async findByPlate(@Param('licensePlate') plate: string) {
    return await this.motorcycleService.findByPlate(plate);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateMotorcycleDto) {
    return await this.motorcycleService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.motorcycleService.remove(id);
  }
}
