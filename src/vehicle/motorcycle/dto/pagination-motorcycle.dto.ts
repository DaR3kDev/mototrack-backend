import { IsInt, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginationDto } from '../../../common/pagination/dto/pagination.dto';

export class PaginationMotorCycleDto extends PaginationDto {
  @IsOptional()
  @IsString({ message: 'El filtro por marca debe ser texto' })
  brand?: string;

  @IsOptional()
  @IsInt({ message: 'El año debe ser un número entero' })
  @Type(() => Number)
  year?: number;
}
