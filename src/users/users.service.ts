import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { Prisma, Role, User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PaginationUserDto } from './dto/pagination-user.dto';
import { DatabaseService } from '../database/database.services';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from '../common/pagination/pagination';

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateUserDto): Promise<ResponseHelper<void>> {
    const [document, phone] = await Promise.all([
      this.db.user.findUnique({ where: { documentNumber: dto.documentNumber } }),
      this.db.user.findFirst({ where: { phone: dto.phone } }),
    ]);

    if (document) throw new ConflictException('El número de documento ya está en uso');
    if (phone) throw new ConflictException('El número de teléfono ya está en uso');

    const [municipality, department, documentType] = await Promise.all([
      this.db.municipality.findUnique({ where: { id: dto.municipalityId } }),
      this.db.department.findUnique({ where: { id: dto.departmentId } }),
      this.db.documentType.findUnique({ where: { id: dto.documentTypeId } }),
    ]);

    if (!municipality) throw new NotFoundException('Municipio no encontrado');
    if (!department) throw new NotFoundException('Departamento no encontrado');
    if (!documentType) throw new NotFoundException('Tipo de documento no encontrado');

    if (dto.password !== dto.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    if (dto.password === dto.documentNumber || dto.password === dto.phone)
      throw new BadRequestException('La contraseña no puede ser igual al documento o teléfono');

    if (/(\w)\1{4,}/.test(dto.password))
      throw new BadRequestException('La contraseña no puede tener caracteres repetidos en exceso');

    if (/12345|abcdef/i.test(dto.password))
      throw new BadRequestException('La contraseña no puede contener secuencias simples');

    const { confirmPassword, ...data } = dto;

    await this.db.user.create({
      data: {
        ...data,
        password: await argon2.hash(dto.password, {
          type: argon2.argon2id,
          timeCost: 4,
          memoryCost: 2 ** 16,
          parallelism: 2,
        }),
      },
    });

    return new ResponseHelper('Usuario creado exitosamente');
  }

  async pagination(
    dto: PaginationUserDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<User>>>> {
    const { page, limit, search, role } = dto;

    const where: Prisma.UserWhereInput = search
      ? {
          OR: [
            { firstname: { contains: search, mode: 'insensitive' } },
            { lastname: { contains: search, mode: 'insensitive' } },
            { role: { equals: role } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.user.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          firstname: true,
          lastname: true,
          documentNumber: true,
          phone: true,
          role: true,
          status: true,
          gender: true,
          municipality: { select: { name: true } },
          documentType: { select: { name: true, abbreviation: true } },
        },
      }),
      this.db.user.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Usuarios obtenidos exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<Partial<User>>> {
    const user = await this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        firstname: true,
        lastname: true,
        documentNumber: true,
        phone: true,
        role: true,
        status: true,
        gender: true,
        municipality: { select: { name: true } },
        department: { select: { name: true } },
        documentType: { select: { name: true, abbreviation: true } },
      },
    });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    return new ResponseHelper('Usuario obtenido exitosamente', user);
  }

  async update(id: string, dto: UpdateUserDto): Promise<ResponseHelper<void>> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (dto.documentNumber && dto.documentNumber !== user.documentNumber) {
      const documentExists = await this.db.user.findUnique({
        where: { documentNumber: dto.documentNumber },
      });
      if (documentExists) throw new ConflictException('El número de documento ya está en uso');
    }

    if (dto.phone && dto.phone !== user.phone) {
      const phoneExists = await this.db.user.findFirst({ where: { phone: dto.phone } });
      if (phoneExists) throw new ConflictException('El teléfono ya está en uso');
    }

    if (dto.confirmPassword && dto.password !== dto.confirmPassword)
      throw new BadRequestException('Las contraseñas no coinciden');

    if (/(\w)\1{4,}/.test(dto.password!))
      throw new BadRequestException('La contraseña no puede tener caracteres repetidos en exceso');

    if (/12345|abcdef/i.test(dto.password!))
      throw new BadRequestException('La contraseña no puede contener secuencias simples');

    if (dto.password === dto.documentNumber || dto.password === dto.phone)
      throw new BadRequestException('La contraseña no puede ser igual al documento o teléfono');

    const { confirmPassword, ...updateData } = dto;

    updateData.password = await argon2.hash(updateData.password!, {
      type: argon2.argon2id,
      timeCost: 4,
      memoryCost: 2 ** 16,
      parallelism: 2,
    });

    await this.db.user.update({
      where: { id },
      data: updateData,
    });

    return new ResponseHelper('Usuario actualizado exitosamente');
  }

  async toggleStatus(id: string): Promise<ResponseHelper<void>> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    await this.db.user.update({
      where: { id },
      data: { status: !user.status },
    });

    return new ResponseHelper(`Usuario ${user.status ? 'desactivado' : 'activado'} exitosamente`);
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    const user = await this.db.user.findUnique({ where: { id } });

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (user.role === Role.ADMIN)
      throw new BadRequestException('No se puede eliminar un usuario administrador principal');

    await this.db.user.delete({ where: { id } });

    return new ResponseHelper('Usuario eliminado exitosamente');
  }
}
