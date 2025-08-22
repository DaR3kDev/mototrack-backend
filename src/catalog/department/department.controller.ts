import { Controller, Get, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { DepartmentService } from './department.service';

@Controller('department')
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  async findAll() {
    return await this.departmentService.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  async findOne(@Param('id') id: string) {
    return await this.departmentService.findOne(id);
  }
}
