import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';

export class PaginationUserDto extends PaginationDto {
  role: Role;
}
