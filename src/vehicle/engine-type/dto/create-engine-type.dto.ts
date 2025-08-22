import { IsString, IsInt, IsNotEmpty, MaxLength, Min, Matches } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class CreateEngineTypeDto {
  @Transform(({ value }) => value.trim())
  @IsString({ message: 'El tipo de motor debe ser texto' })
  @MaxLength(50, { message: 'El tipo de motor no puede tener más de 50 caracteres' })
  @IsNotEmpty({ message: 'El tipo de motor es obligatorio' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ0-9\s-]+$/, {
    message: 'El tipo de motor solo puede contener letras, números, espacios y guiones',
  })
  type: string;

  @Type(() => Number)
  @IsInt({ message: 'La potencia (horsepower) debe ser un número entero' })
  @Min(0, { message: 'La potencia no puede ser negativa' })
  horsepower: number;

  @Type(() => Number)
  @IsInt({ message: 'El torque debe ser un número entero' })
  @Min(0, { message: 'El torque no puede ser negativo' })
  torque: number;
}
