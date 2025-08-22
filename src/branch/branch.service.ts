import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Branch, Prisma } from '@prisma/client';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { DatabaseService } from '../database/database.services';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginationDto } from '../common/pagination/dto/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';

@Injectable()
export class BranchService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateBranchDto): Promise<ResponseHelper<void>> {
    const [name, phone, address] = await Promise.all([
      this.db.branch.findFirst({ where: { name: dto.name } }),
      this.db.branch.findFirst({ where: { phone: dto.phone } }),
      this.db.branch.findFirst({ where: { address: dto.address } }),
    ]);

    if (name) throw new ConflictException('La sucursal ya existe');
    if (phone) throw new ConflictException('El teléfono ya está registrado');
    if (address) throw new ConflictException('La dirección ya está registrada');

    await this.db.branch.create({
      data: {
        ...dto,
      },
    });

    return new ResponseHelper('Sucursal creada exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Branch>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.BranchWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { phone: { contains: search, mode: 'insensitive' } },
                { address: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.db.branch.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          address: true,
          phone: true,
          municipality: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.db.branch.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Sucursales obtenidas exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Branch>> {
    const branch = await this.db.branch.findUnique({ where: { id } });

    if (!branch) throw new NotFoundException('Sucursal no encontrada');

    return new ResponseHelper('Sucursal encontrada', branch);
  }

  async findInventory(id: string): Promise<ResponseHelper<Partial<Branch>>> {
    const branch = await this.db.branch.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        Inventory: true,
      },
    });

    if (!branch) throw new NotFoundException('Sucursal no encontrada');

    return new ResponseHelper('Inventario y citas encontradas', branch);
  }

  async update(id: string, dto: UpdateBranchDto): Promise<ResponseHelper<void>> {
    const branch = await this.db.branch.findUnique({ where: { id } });

    if (!branch) throw new NotFoundException('Sucursal no encontrada');

    if (dto.name && dto.name !== branch.name) {
      const name = await this.db.branch.findFirst({ where: { name: dto.name } });
      if (name) throw new ConflictException('La sucursal ya existe');
    }

    if (dto.address && dto.address !== branch.address) {
      const address = await this.db.branch.findFirst({ where: { address: dto.address } });
      if (address) throw new ConflictException('La dirección ya está registrada');
    }

    if (dto.phone && dto.phone !== branch.phone) {
      const phone = await this.db.branch.findFirst({ where: { phone: dto.phone } });
      if (phone) throw new ConflictException('El teléfono ya está registrado');
    }

    if (dto.municipalityId && dto.municipalityId !== branch.municipalityId) {
      const municipality = await this.db.municipality.findFirst({
        where: { id: dto.municipalityId },
      });
      if (!municipality) throw new NotFoundException('Municipio no encontrado');
    }

    await this.db.branch.update({
      where: { id },
      data: { ...dto },
    });

    return new ResponseHelper('Sucursal actualizada exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const branch = await this.db.branch.findUnique({ where: { id } });

    if (!branch) throw new NotFoundException('Sucursal no encontrada');

    const [citation, inventary] = await Promise.all([
      this.db.citation.findFirst({ where: { branchId: id } }),
      this.db.inventory.findFirst({ where: { branchId: id } }),
    ]);

    if (citation)
      throw new ConflictException('No se puede eliminar la sucursal porque tiene citas asociadas');

    if (inventary)
      throw new ConflictException(
        'No se puede eliminar la sucursal porque tiene inventario asociado',
      );

    await this.db.branch.delete({ where: { id } });

    return new ResponseHelper('Sucursal eliminada exitosamente');
  }
}
