import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Municipality, Prisma } from '@prisma/client';
import { CreateMunicipalityDto } from './dto/create-municipality.dto';
import { UpdateMunicipalityDto } from './dto/update-municipality.dto';
import { DatabaseService } from '../../database/database.services';
import { ResponseHelper } from '../../common/response/response.helper';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { PaginatedResponse } from '../../common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from '../../common/pagination/pagination';

@Injectable()
export class MunicipalityService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateMunicipalityDto): Promise<ResponseHelper<void>> {
    const exist = await this.db.municipality.findUnique({ where: { name: dto.name } });

    if (exist) throw new ConflictException('Ya existe un municipio con el mismo nombre');

    await this.db.municipality.create({ data: dto });

    return new ResponseHelper<void>('Municipio creado exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Municipality>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.MunicipalityWhereInput = search
      ? {
          OR: [{ name: { contains: search, mode: 'insensitive' } }],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.municipality.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.municipality.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Municipios. obtenidos exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Municipality>> {
    const municipality = await this.db.municipality.findUnique({ where: { id } });

    if (!municipality) throw new NotFoundException('Municipio no encontrado');

    return new ResponseHelper('Municipio obtenido exitosamente', municipality);
  }

  async update(id: string, dto: UpdateMunicipalityDto): Promise<ResponseHelper<void>> {
    const municipality = await this.db.municipality.findUnique({ where: { id } });

    if (!municipality) throw new NotFoundException('Municipio no encontrado');

    await this.db.municipality.update({ where: { id }, data: dto });

    return new ResponseHelper<void>('Municipio actualizado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const municipality = await this.db.municipality.findUnique({ where: { id } });

    if (!municipality) throw new NotFoundException('Municipio no encontrado');

    await this.db.municipality.delete({ where: { id } });

    return new ResponseHelper<void>('Municipio eliminado exitosamente');
  }
}
