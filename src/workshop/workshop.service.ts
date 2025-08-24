import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { DatabaseService } from '../database/database.services';
import { ResponseHelper } from 'src/common/response/response.helper';
import { Prisma, Workshop } from '@prisma/client';
import { PaginationDto } from 'src/common/pagination/dto/pagination.dto';
import { PaginatedResponse } from 'src/common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from 'src/common/pagination/pagination';

@Injectable()
export class WorkshopService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateWorkshopDto): Promise<ResponseHelper<void>> {
    const [name, address, phone] = await Promise.all([
      this.db.workshop.findFirst({ where: { name: dto.name } }),
      this.db.workshop.findFirst({ where: { address: dto.address } }),
      this.db.workshop.findFirst({ where: { phone: dto.phone } }),
    ]);

    if (name) throw new ConflictException('El nombre del taller ya está en uso');
    if (address) throw new ConflictException('La dirección del taller ya está en uso');
    if (phone) throw new ConflictException('El teléfono del taller ya está en uso');

    await this.db.workshop.create({ data: dto });

    return new ResponseHelper('Taller creado exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Workshop>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.WorkshopWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { address: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.workshop.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          municipality: {
            select: { name: true },
          },
        },
        orderBy: { name: 'asc' },
      }),
      this.db.workshop.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Taller obtenido exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Partial<Workshop>>> {
    const workshop = await this.db.workshop.findUnique({ where: { id } });

    if (!workshop) throw new NotFoundException(`El taller  no existe`);

    return new ResponseHelper('Taller encontrado', workshop);
  }

  async update(id: string, dto: UpdateWorkshopDto): Promise<ResponseHelper<void>> {
    const workshop = await this.db.workshop.findUnique({ where: { id } });

    if (!workshop) throw new NotFoundException(`El taller no existe`);

    if (dto.name && dto.name !== workshop.name) {
      const existingWorkshop = await this.db.workshop.findUnique({ where: { name: dto.name } });

      if (existingWorkshop) throw new ConflictException('El nombre del taller ya está en uso');
    }

    if (dto.address && dto.address !== workshop.address) {
      const existingWorkshop = await this.db.workshop.findFirst({
        where: { address: dto.address },
      });

      if (existingWorkshop) throw new ConflictException('La dirección del taller ya está en uso');
    }

    if (dto.phone && dto.phone !== workshop.phone) {
      const existingWorkshop = await this.db.workshop.findFirst({
        where: { phone: dto.phone },
      });

      if (existingWorkshop) throw new ConflictException('El teléfono del taller ya está en uso');
    }

    await this.db.workshop.update({ where: { id }, data: dto });

    return new ResponseHelper('Taller actualizado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const workshop = await this.db.workshop.findUnique({ where: { id } });

    if (!workshop) throw new NotFoundException(`El taller no existe`);

    await this.db.workshop.delete({ where: { id } });

    return new ResponseHelper('Taller eliminado exitosamente');
  }
}
