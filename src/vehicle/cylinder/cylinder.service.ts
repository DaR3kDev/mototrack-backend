import { Injectable } from '@nestjs/common';
import { CreateCylinderDto } from './dto/create-cylinder.dto';
import { UpdateCylinderDto } from './dto/update-cylinder.dto';

@Injectable()
export class CylinderService {
  create(createCylinderDto: CreateCylinderDto) {
    return 'This action adds a new cylinder';
  }

  findAll() {
    return `This action returns all cylinder`;
  }

  findOne(id: number) {
    return `This action returns a #${id} cylinder`;
  }

  update(id: number, updateCylinderDto: UpdateCylinderDto) {
    return `This action updates a #${id} cylinder`;
  }

  remove(id: number) {
    return `This action removes a #${id} cylinder`;
  }
}
