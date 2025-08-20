import { Injectable, NotFoundException } from '@nestjs/common';
import { Department } from '@prisma/client';
import { DatabaseService } from '../../database/database.services';
import { ResponseHelper } from '../../common/response/response.helper';
import { departmentsColombia } from './data/department-colombia';

@Injectable()
export class DepartmentService {
  constructor(private readonly db: DatabaseService) {
    this.initDepartments();
  }

  async findAll(): Promise<ResponseHelper<Department[]>> {
    const departments = await this.db.department.findMany();
    return new ResponseHelper('Departamentos obtenidos exitosamente', departments);
  }

  async findOne(id: string): Promise<ResponseHelper<Department>> {
    const department = await this.db.department.findUnique({ where: { id } });

    if (!department) throw new NotFoundException('Departamento no encontrado');

    return new ResponseHelper('Departamento obtenido exitosamente', department);
  }

  private async initDepartments() {
    await this.db.department.createMany({
      data: departmentsColombia.map(d => ({ name: d.name })),
      skipDuplicates: true,
    });
  }
}
