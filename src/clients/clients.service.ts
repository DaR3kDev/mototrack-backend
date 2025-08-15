import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Client, Prisma } from '@prisma/client';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { DatabaseService } from '../database/database.services';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';
import { PaginationDto } from '../common/pagination/dto/pagination.dto';
import { PaginationHelper } from '../common/pagination/pagination';

@Injectable()
export class ClientsService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateClientDto): Promise<ResponseHelper<void>> {
    const email = this.db.client.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!email) throw new ConflictException('Email ya existe');

    const documentNumber = this.db.client.findFirst({
      where: {
        documentNumber: dto.documentNumber,
      },
    });

    if (!documentNumber) throw new ConflictException('Número de documento ya existe');

    await this.db.client.create({
      data: dto,
    });

    return new ResponseHelper<void>('Cliente creado exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Client>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.ClientWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { phone: { contains: search, mode: 'insensitive' } },
            { documentNumber: { contains: search, mode: 'insensitive' } },
            {
              documentType: {
                name: { contains: search, mode: 'insensitive' },
                abbreviation: { contains: search, mode: 'insensitive' },
              },
            },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.client.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true,
          name: true,
          documentNumber: true,
          phone: true,
          email: true,
          gender: true,
          documentType: { select: { name: true, abbreviation: true } },
        },
      }),
      this.db.client.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Clientes obtenidos exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Partial<Client>>> {
    const client = await this.db.client.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        email: true,
        documentNumber: true,
        name: true,
        phone: true,
        gender: true,
        documentType: { select: { name: true, abbreviation: true } },
      },
    });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    return new ResponseHelper('Cliente obtenido exitosamente', client);
  }

  async update(id: string, dto: UpdateClientDto): Promise<ResponseHelper<void>> {
    const client = await this.db.client.findUnique({ where: { id } });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    if (dto.email && dto.email !== client.email) {
      const emailExists = await this.db.client.findFirst({
        where: {
          email: dto.email,
        },
      });
      if (emailExists) throw new ConflictException('Email ya existe');
    }

    if (dto.documentNumber && dto.documentNumber !== client.documentNumber) {
      const documentNumberExists = await this.db.client.findFirst({
        where: {
          documentNumber: dto.documentNumber,
        },
      });
      if (documentNumberExists) throw new ConflictException('Número de documento ya existe');
    }

    await this.db.client.update({
      where: { id },
      data: dto,
    });

    return new ResponseHelper<void>('Cliente creado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const client = await this.db.client.findUnique({ where: { id } });

    if (!client) throw new NotFoundException('Cliente no encontrado');

    await this.db.client.delete({ where: { id } });

    return new ResponseHelper<void>('Cliente eliminado exitosamente');
  }
}
