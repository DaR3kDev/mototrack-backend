import { IsString, IsNotEmpty, IsDefined, Length, IsAlpha, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateMunicipalityDto {
  @IsDefined({ message: 'Por favor ingrese el nombre del municipio' })
  @IsString({ message: 'El nombre del municipio debe contener solo letras' })
  @IsNotEmpty({ message: 'El nombre del municipio no puede estar vacío' })
  @IsAlpha('es-ES', { message: 'El nombre del municipio solo puede contener letras' })
  @Length(2, 50, { message: 'El nombre del municipio debe tener entre 2 y 50 letras' })
  name: string;

  @IsDefined({ message: 'Por favor indique si el municipio está activo o inactivo' })
  @Type(() => Boolean)
  @IsBoolean({ message: 'El estado del municipio debe ser activo o inactivo' })
  status: boolean;
}
