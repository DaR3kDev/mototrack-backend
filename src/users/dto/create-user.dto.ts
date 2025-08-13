import {
  IsString,
  IsNotEmpty,
  Length,
  IsAlpha,
  IsAlphanumeric,
  Matches,
  MinLength,
  IsEnum,
  IsBoolean,
  IsUUID,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { Role, Gender } from '@prisma/client';
import { Match } from '../../common/decorators/match.decorator';

export class CreateUserDto {
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsAlpha('es-ES', { message: 'El nombre solo puede contener letras' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 letras' })
  firstname: string;

  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  @IsString({ message: 'El apellido debe ser texto' })
  @IsNotEmpty({ message: 'El apellido no puede estar vacío' })
  @IsAlpha('es-ES', { message: 'El apellido solo puede contener letras' })
  @Length(2, 50, { message: 'El apellido debe tener entre 2 y 50 letras' })
  lastname: string;

  @IsString({ message: 'La contraseña debe ser texto' })
  @MinLength(8, { message: 'La contraseña debe tener al menos 8 caracteres' })
  @Matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z\d]).*$/, {
    message: 'La contraseña debe incluir mayúsculas, minúsculas, números y un carácter especial',
  })
  @Matches(/^\S+$/, { message: 'La contraseña no puede contener espacios' })
  password: string;

  @Match<CreateUserDto>('password', { message: 'Las contraseñas no coinciden' })
  confirmPassword: string;

  @Transform(({ value }) => value.replace(/\s+/g, '').toUpperCase())
  @IsAlphanumeric('es-ES', {
    message: 'El número de documento solo puede contener letras y números',
  })
  @Length(5, 20, { message: 'El número de documento debe tener entre 5 y 20 caracteres' })
  documentNumber: string;

  @Transform(({ value }) => value.replace(/\s+/g, ''))
  @Matches(/^\+?\d{7,15}$/, { message: 'Ingrese un número de teléfono válido' })
  phone: string;

  @IsEnum(Role, { message: 'El rol no es válido' })
  role: Role;

  @Type(() => Boolean)
  @IsBoolean({ message: 'El estado debe ser activo o inactivo' })
  status: boolean;

  @IsEnum(Gender, { message: 'El género no es válido' })
  gender: Gender;

  @IsUUID('4', { message: 'El ID de municipio no es válido' })
  municipalityId: string;

  @IsUUID('4', { message: 'El ID de departamento no es válido' })
  departmentId: string;

  @IsUUID('4', { message: 'El ID de tipo de documento no es válido' })
  documentTypeId: string;
}
