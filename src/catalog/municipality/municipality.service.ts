import { Injectable, NotFoundException } from '@nestjs/common';
import { Municipality } from '@prisma/client';
import { DatabaseService } from '../../database/database.services';
import { ResponseHelper } from '../../common/response/response.helper';
import { municipalitiesColombia } from './data/municipalities-colombia';

@Injectable()
export class MunicipalityService {
  constructor(private readonly db: DatabaseService) {
    this.initMunicipalities();
  }

  async findAll(): Promise<ResponseHelper<Municipality[]>> {
    const municipalities = await this.db.municipality.findMany();
    return new ResponseHelper('Municipios obtenidos exitosamente', municipalities);
  }

  async findOne(id: string): Promise<ResponseHelper<Municipality>> {
    const municipality = await this.db.municipality.findUnique({ where: { id } });

    if (!municipality) throw new NotFoundException('Municipio no encontrado');

    return new ResponseHelper('Municipio obtenido exitosamente', municipality);
  }

  private async initMunicipalities() {
    await Promise.all(
      municipalitiesColombia.map(async item => {
        const department = await this.db.department.findFirst({
          where: { name: item.departmentName },
        });

        if (!department) return;

        await this.db.municipality.createMany({
          data: [{ name: item.name, departmentId: department.id }],
          skipDuplicates: true,
        });
      }),
    );
  }
}
