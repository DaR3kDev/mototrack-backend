import { Injectable } from '@nestjs/common';
import { CreateMotorcycleDto } from './dto/create-motorcycle.dto';
import { UpdateMotorcycleDto } from './dto/update-motorcycle.dto';

@Injectable()
export class MotorcycleService {
  create(createMotorcycleDto: CreateMotorcycleDto) {
    return 'This action adds a new motorcycle';
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
