import { Role } from '@prisma/client';
import { PaginationDto } from '../../common/pagination/dto/pagination.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class PaginationUserDto extends PaginationDto {
  @IsOptional()
  @IsEnum(Role, { message: 'El rol no es válido' })
  @Transform(({ value }) => (value === '' ? undefined : value))
  role?: Role;
}
