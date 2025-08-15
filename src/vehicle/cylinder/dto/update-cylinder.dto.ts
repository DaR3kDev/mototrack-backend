import { PartialType } from '@nestjs/mapped-types';
import { CreateCylinderDto } from './create-cylinder.dto';

export class UpdateCylinderDto extends PartialType(CreateCylinderDto) {}
