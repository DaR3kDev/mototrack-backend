import { IsNumber, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateCylinderDto {
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'El diámetro debe ser un número' })
  @Min(0, { message: 'El diámetro no puede ser negativo' })
  diameter: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La carrera (stroke) debe ser un número' })
  @Min(0, { message: 'La carrera no puede ser negativa' })
  stroke: number;

  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'La compresión debe ser un número' })
  @Min(0, { message: 'La compresión no puede ser negativa' })
  compression: number;
}
