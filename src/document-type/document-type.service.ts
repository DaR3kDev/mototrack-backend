import { ConflictException, Injectable } from '@nestjs/common';
import { DocumentType, Prisma } from '@prisma/client';
import { DatabaseService } from '../database/database.services';
import { CreateDocumentTypeDto } from './dto/create-document-type.dto';
import { UpdateDocumentTypeDto } from './dto/update-document-type.dto';
import { ResponseHelper } from '../common/response/response.helper';
import { PaginationDto } from '../common/pagination/dto/pagination.dto';
import { PaginatedResponse } from '../common/pagination/interfaces/pagination.interface';
import { PaginationHelper } from '../common/pagination/pagination';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly db: DatabaseService) {}

  async create(dto: CreateDocumentTypeDto): Promise<ResponseHelper<void>> {
    const existing = await this.db.documentType.findFirst({
      where: {
        OR: [{ name: dto.name }, { abbreviation: dto.abbreviation }],
      },
    });

    if (existing)
      throw new ConflictException(
        'Ya existe un tipo de documento con el mismo nombre o abreviación',
      );

    await this.db.documentType.create({ data: dto });

    return new ResponseHelper('Tipo de documento creado exitosamente');
  }

  async pagination(
    dto: PaginationDto,
  ): Promise<ResponseHelper<PaginatedResponse<Partial<DocumentType>>>> {
    const { page, limit, search } = dto;

    const where: Prisma.DocumentTypeWhereInput = search
      ? {
          OR: [
            { name: { contains: search, mode: 'insensitive' } },
            { abbreviation: { contains: search, mode: 'insensitive' } },
          ],
        }
      : {};

    const [items, total] = await Promise.all([
      this.db.documentType.findMany({
        where,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.documentType.count({ where }),
    ]);

    const data = PaginationHelper.build(items, total, page, limit);

    return new ResponseHelper('Tipos de documentos obtenidos exitosamente', data);
  }

  async findOne(id: string): Promise<ResponseHelper<DocumentType>> {
    const found = await this.db.documentType.findUnique({ where: { id } });

    if (!found) throw new ConflictException('Tipo de documento no encontrado');

    return new ResponseHelper('Tipo de documento obtenido exitosamente', found);
  }

  async update(id: string, dto: UpdateDocumentTypeDto): Promise<ResponseHelper<void>> {
    await this.db.documentType.update({
      where: { id },
      data: dto,
    });

    return new ResponseHelper('Tipo de documento actualizado exitosamente');
  }

  async remove(id: string): Promise<ResponseHelper<void>> {
    await this.db.documentType.delete({ where: { id } });

    return new ResponseHelper('Tipo de documento eliminado exitosamente');
  }
}
