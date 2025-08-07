import { IsString, IsNotEmpty, IsDefined, Length, IsAlpha } from 'class-validator';

export class CreateDepartmentDto {
  @IsDefined({ message: 'Por favor ingrese el nombre del departamento' })
  @IsString({ message: 'El nombre del departamento debe contener solo letras' })
  @IsNotEmpty({ message: 'El nombre del departamento no puede estar vacío' })
  @IsAlpha('es-ES', { message: 'El nombre del departamento solo puede contener letras' })
  @Length(2, 50, { message: 'El nombre del departamento debe tener entre 2 y 50 letras' })
  name: string;
}
