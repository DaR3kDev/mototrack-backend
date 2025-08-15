import { PartialType } from '@nestjs/mapped-types';
import { CreateEngineTypeDto } from './create-engine-type.dto';

export class UpdateEngineTypeDto extends PartialType(CreateEngineTypeDto) {}
