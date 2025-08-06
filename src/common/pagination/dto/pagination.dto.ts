import { IsInt, Min, Max, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';

export class PaginationDto {
  @IsInt({ message: 'El número de página debe ser un número entero' })
  @Min(1, { message: 'La página debe ser al menos 1' })
  @Type(() => Number)
  page: number;

  @IsInt({ message: 'El límite debe ser un número entero' })
  @Min(1, { message: 'El límite mínimo es 1' })
  @Max(100, { message: 'El límite máximo es 100' })
  @Type(() => Number)
  limit: number;

  @IsOptional()
  @IsString({ message: 'El parámetro de búsqueda debe ser texto' })
  @Type(() => String)
  search?: string;
}
