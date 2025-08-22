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
import { BranchService } from './branch.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';

@Controller('branch')
export class BranchController {
  constructor(private readonly branchService: BranchService) {}

  @HttpCode(HttpStatus.CREATED)
  @Post()
  async create(@Body() dto: CreateBranchDto) {
    return await this.branchService.create(dto);
  }

  @HttpCode(HttpStatus.CREATED)
  @Get()
  async pagination(@Query() dto: PaginationDto) {
    return await this.branchService.pagination(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.branchService.findOne(id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('inventory/:id')
  async findInventory(@Param('id') id: string) {
    return await this.branchService.findInventory(id);
  }

  @HttpCode(HttpStatus.OK)
  @Patch(':id')
  async update(@Param('id') id: string, @Body() dto: UpdateBranchDto) {
    return await this.branchService.update(id, dto);
  }

  @HttpCode(HttpStatus.OK)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.branchService.remove(id);
  }
}
