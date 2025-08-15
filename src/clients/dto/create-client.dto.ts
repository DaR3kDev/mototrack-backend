import { Gender } from '@prisma/client';
import { IsString, IsNotEmpty, Length, IsAlphanumeric, Matches, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { IsCuid } from '../../common/decorators/is-cuid.decorator';

export class CreateClientDto {
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Matches(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
    message: 'El nombre solo puede contener letras y espacios',
  })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 letras' })
  name: string;

  @Transform(({ value }) => value.replace(/\s+/g, ''))
  @Matches(/^\+?\d{7,15}$/, { message: 'Ingrese un número de teléfono válido' })
  phone: string;

  @Transform(({ value }) => value.trim().toLowerCase())
  @IsNotEmpty({ message: 'El correo no puede estar vacío' })
  @Matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, { message: 'Correo inválido' })
  email: string;

  @Transform(({ value }) => value.replace(/\s+/g, '').toUpperCase())
  @IsAlphanumeric('es-ES', {
    message: 'El número de documento solo puede contener letras y números',
  })
  @Length(5, 20, { message: 'El número de documento debe tener entre 5 y 20 caracteres' })
  documentNumber: string;

  @IsEnum(Gender, { message: 'El género no es válido' })
  @IsNotEmpty({ message: 'El género no puede estar vacío' })
  gender: Gender;

  @IsCuid({ message: 'El ID de tipo de documento no es válido' })
  documentTypeId!: string;
}
