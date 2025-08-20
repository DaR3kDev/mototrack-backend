import {
  IsString,
  IsInt,
  IsNotEmpty,
  MaxLength,
  Min,
  Max,
  Matches,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { IsCuid } from '../../../common/decorators/is-cuid.decorator';
import { CreateCylinderDto } from '../../../vehicle/cylinder/dto/create-cylinder.dto';
import { CreateEngineTypeDto } from '../../../vehicle/engine-type/dto/create-engine-type.dto';

export class CreateMotorcycleDto {
  @IsCuid({ message: 'El ID del cliente debe ser un CUID válido' })
  @IsNotEmpty({ message: 'El ID del cliente es obligatorio' })
  clientId: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'La marca debe ser texto' })
  @MaxLength(50, { message: 'La marca no puede tener más de 50 caracteres' })
  brand: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'El modelo debe ser texto' })
  @MaxLength(50, { message: 'El modelo no puede tener más de 50 caracteres' })
  model: string;

  @IsInt({ message: 'El año debe ser un número entero' })
  @Min(1900, { message: 'El año no puede ser menor que 1900' })
  @Max(new Date().getFullYear() + 1, {
    message: `El año no puede ser mayor que ${new Date().getFullYear() + 1}`,
  })
  year: number;

  @Transform(({ value }) => value.trim().toUpperCase())
  @Matches(/^[A-Z0-9]{5,10}$/, {
    message: 'La placa debe tener entre 5 y 10 caracteres alfanuméricos sin espacios',
  })
  @MaxLength(10, { message: 'La placa no puede tener más de 10 caracteres' })
  licensePlate: string;

  @Transform(({ value }) => value.trim())
  @IsString({ message: 'El color debe ser texto' })
  @MaxLength(30, { message: 'El color no puede tener más de 30 caracteres' })
  color: string;

  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString({ message: 'El número de motor debe ser texto' })
  @MaxLength(50, { message: 'El número de motor no puede tener más de 50 caracteres' })
  numberEngine: string;

  @Transform(({ value }) => value.trim().toUpperCase())
  @IsString({ message: 'El número de chasis debe ser texto' })
  @MaxLength(50, { message: 'El número de chasis no puede tener más de 50 caracteres' })
  numberChassis: string;

  @IsInt({ message: 'El cilindraje debe ser un número entero' })
  @Min(0, { message: 'El cilindraje no puede ser negativo' })
  cubicaje: number;

  @ValidateNested()
  @Type(() => CreateCylinderDto)
  cylinder?: CreateCylinderDto;

  @ValidateNested()
  @Type(() => CreateEngineTypeDto)
  engineType?: CreateEngineTypeDto;
}
