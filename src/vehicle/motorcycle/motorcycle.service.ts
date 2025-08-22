import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Client, Motorcycle, Prisma } from '@prisma/client';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { ResponseHelper } from '../../common/response/response.helper';
import { DatabaseService } from '../../database/database.services';
import { PaginationMotorCycleDto } from './dto/pagination-motorcycle.dto';
import { PaginationHelper } from '../../common/pagination/pagination';
import { PaginatedResponse } from '../../common/pagination/interfaces/pagination.interface';

@Injectable()
export class MotorcycleService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateMotorcycleDto): Promise<ResponseHelper<void>> {
    const client = await this.db.client.findUnique({ where: { id: dto.clientId } });
    if (!client) throw new ConflictException('Cliente no encontrado');

    const [plate, engineNumber, chassisNumber] = await Promise.all([
      this.db.motorcycle.findUnique({ where: { licensePlate: dto.licensePlate } }),
      this.db.motorcycle.findUnique({ where: { numberEngine: dto.numberEngine } }),
      this.db.motorcycle.findUnique({ where: { numberChassis: dto.numberChassis } }),
    ]);

    if (plate) throw new ConflictException('La placa ya está registrada');
    if (engineNumber) throw new ConflictException('El número de motor ya está registrado');
    if (chassisNumber) throw new ConflictException('El número de chasis ya está registrado');

    if (!dto.cylinder) throw new ConflictException('La información del cilindro es requerida');
    if (!dto.engineType)
      throw new ConflictException('La información del tipo de motor es requerida');

    const { cylinder, engineType, clientId, ...motorcycleData } = dto;

    await this.db.$transaction(async prisma => {
      await prisma.motorcycle.create({
        data: {
          ...motorcycleData,
          client: { connect: { id: clientId } },
          engineType: {
            create: {
              type: dto.engineType!.type,
              horsepower: dto.engineType!.horsepower,
              torque: dto.engineType!.torque,
            },
          },
          Cylinder: {
            create: {
              diameter: dto.cylinder!.diameter,
              stroke: dto.cylinder!.stroke,
              compression: dto.cylinder!.compression,
            },
          },
        },
        include: {
          engineType: true,
          Cylinder: true,
        },
      });
    });

    return new ResponseHelper<void>('Motocicleta creada exitosamente');
  }

  async pagination(
    dto: PaginationMotorCycleDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<Motorcycle>>>> {
    const { page, limit, search, brand, year } = dto;

    const where: Prisma.MotorcycleWhereInput = {
      AND: [
        search
          ? {
              OR: [
                { licensePlate: { contains: search, mode: 'insensitive' } },
                { brand: { contains: search, mode: 'insensitive' } },
                { model: { contains: search, mode: 'insensitive' } },
                { color: { contains: search, mode: 'insensitive' } },
              ],
            }
          : {},
        brand ? { brand: { contains: brand, mode: 'insensitive' } } : {},
        year ? { year: Number(year) } : {},
      ],
    };

    const [items, total] = await Promise.all([
      this.db.motorcycle.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          licensePlate: true,
          brand: true,
          model: true,
          year: true,
          color: true,
          cubicaje: true,
          client: {
            select: {
              name: true,
              phone: true,
              documentNumber: true,
              documentType: {
                select: { abbreviation: true },
              },
            },
          },
        },
      }),
      this.db.motorcycle.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Motocicleta obtenida exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Partial<Motorcycle>>> {
    const motorcycle = await this.db.motorcycle.findUnique({
      where: { id },
      select: {
        id: true,
        licensePlate: true,
        brand: true,
        model: true,
        year: true,
        color: true,
        cubicaje: true,
        client: {
          select: {
            name: true,
            phone: true,
            documentNumber: true,
            documentType: { select: { abbreviation: true } },
          },
        },
      },
    });

    if (!motorcycle) throw new NotFoundException('Motocicleta no encontrada');

    return new ResponseHelper('Motocicleta obtenida exitosamente', motorcycle);
  }

  async findByPlate(licensePlate: string): Promise<ResponseHelper<Partial<Motorcycle>>> {
    const motorcycle = await this.db.motorcycle.findUnique({
      where: { licensePlate },
      select: {
        id: true,
        brand: true,
        model: true,
        year: true,
        licensePlate: true,
        color: true,
        cubicaje: true,
        numberEngine: true,
        numberChassis: true,
        engineType: {
          select: {
            type: true,
            horsepower: true,
            torque: true,
          },
        },
        Cylinder: {
          select: {
            diameter: true,
            stroke: true,
            compression: true,
          },
        },
      },
    });

    if (!motorcycle) throw new NotFoundException('Motocicleta no encontrada');

    return new ResponseHelper('Motocicleta obtenida exitosamente', motorcycle);
  }

  async update(id: string, dto: UpdateMotorcycleDto): Promise<ResponseHelper<void>> {
    const moto = await this.db.motorcycle.findUnique({
      where: { id },
      include: { engineType: true, Cylinder: true },
    });

    if (!moto) throw new NotFoundException('Motocicleta no encontrada');

    const { clientId, licensePlate, numberEngine, numberChassis, engineType, cylinder, ...rest } =
      dto;

    if (clientId && !(await this.db.client.findUnique({ where: { id: clientId } })))
      throw new ConflictException('Cliente no encontrado');

    if (
      licensePlate &&
      licensePlate !== moto.licensePlate &&
      (await this.db.motorcycle.findUnique({ where: { licensePlate } }))
    )
      throw new ConflictException('La placa ya está registrada');

    if (
      numberEngine &&
      numberEngine !== moto.numberEngine &&
      (await this.db.motorcycle.findUnique({ where: { numberEngine } }))
    )
      throw new ConflictException('El número de motor ya está registrado');

    if (
      numberChassis &&
      numberChassis !== moto.numberChassis &&
      (await this.db.motorcycle.findUnique({ where: { numberChassis } }))
    )
      throw new ConflictException('El número de chasis ya está registrado');

    if (engineType && (!engineType.type || !engineType.horsepower || !engineType.torque))
      throw new ConflictException('Tipo de motor incompleto');

    if (cylinder && (!cylinder.diameter || !cylinder.stroke || !cylinder.compression))
      throw new ConflictException('Cilindro incompleto');

    const data = {
      ...rest,
      ...(clientId && { client: { connect: { id: clientId } } }),
      ...(licensePlate && { licensePlate }),
      ...(numberEngine && { numberEngine }),
      ...(numberChassis && { numberChassis }),
      ...(engineType && { engineType: { update: engineType } }),
      ...(cylinder && { Cylinder: { update: cylinder } }),
    };

    await this.db.motorcycle.update({ where: { id }, data });
    return new ResponseHelper('Motocicleta actualizada exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const motorcycle = await this.db.motorcycle.findUnique({ where: { id } });

    if (!motorcycle) throw new NotFoundException('Motocicleta no encontrada');

    await this.db.motorcycle.delete({ where: { id } });

    return new ResponseHelper('Motocicleta eliminada exitosamente');
  }
}
