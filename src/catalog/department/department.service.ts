import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Department, Prisma } from '@prisma/client';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DatabaseService } from '../../database/database.services';
import { ResponseHelper } from '../../common/response/response.helper';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { PaginatedResponse } from '../../common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from '../../common/pagination/pagination';

@Injectable()
export class DepartmentService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateDepartmentDto): Promise<ResponseHelper<void>> {
    const existing = await this.db.department.findFirst({
      where: { name: dto.name },
    });

    if (existing) throw new ConflictException('Ya existe un departamento con el mismo nombre');

    await this.db.department.create({ data: dto });

    return new ResponseHelper<void>('Departamento creado exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Department>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.DepartmentWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.department.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.department.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Departamentos obtenidos exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Department>> {
    const department = await this.db.department.findUnique({ where: { id } });

    if (!department) throw new NotFoundException('Departamento no encontrado');

    return new ResponseHelper('Departamento obtenido exitosamente', department);
  }

  async update(id: string, dto: UpdateDepartmentDto): Promise<ResponseHelper<void>> {
    const department = await this.db.department.findUnique({ where: { id } });

    if (!department) throw new NotFoundException('Departamento no encontrado');

    await this.db.department.update({ where: { id }, data: dto });

    return new ResponseHelper<void>('Departamento actualizado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const department = await this.db.department.findUnique({ where: { id } });

    if (!department) throw new NotFoundException('Departamento no encontrado');

    await this.db.department.delete({ where: { id } });

    return new ResponseHelper<void>('Departamento eliminado exitosamente');
  }
}
