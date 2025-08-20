import { ConflictException, Injectable } from '@nestjs/common';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';
import { ResponseHelper } from '../../common/response/response.helper';
import { DatabaseService } from '../../database/database.services';

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

  findAll() {
    return `This action returns all motorcycle`;
  }

  findOne(id: number) {
    return `This action returns a #${id} motorcycle`;
  }

  update(id: number, updateMotorcycleDto: UpdateMotorcycleDto) {
    return `This action updates a #${id} motorcycle`;
  }

  remove(id: number) {
    return `This action removes a #${id} motorcycle`;
  }
}
