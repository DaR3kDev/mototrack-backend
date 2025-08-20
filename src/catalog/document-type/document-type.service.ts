import { ConflictException, Injectable } from '@nestjs/common';
import { DocumentType } from '@prisma/client';
import { DatabaseService } from '../../database/database.services';
import { ResponseHelper } from '../../common/response/response.helper';
import { defaultTypes } from './data/document-type';

@Injectable()
export class DocumentTypeService {
  constructor(private readonly db: DatabaseService) {
    this.initDefaultDocumentTypes();
  }

  async findAll(): Promise<ResponseHelper<DocumentType[]>> {
    const found = await this.db.documentType.findMany();
    return new ResponseHelper('Tipos de documento obtenidos exitosamente', found);
  }

  async findOne(id: string): Promise<ResponseHelper<DocumentType>> {
    const found = await this.db.documentType.findUnique({ where: { id } });

    if (!found) throw new ConflictException('Tipo de documento no encontrado');

    return new ResponseHelper('Tipo de documento obtenido exitosamente', found);
  }

  private async initDefaultDocumentTypes() {
    await this.db.documentType.createMany({
      data: defaultTypes,
      skipDuplicates: true,
    });
  }
}
