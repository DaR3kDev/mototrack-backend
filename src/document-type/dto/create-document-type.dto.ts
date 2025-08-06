import {
  IsString,
  IsNotEmpty,
  IsDefined,
  Length,
  MinLength,
  MaxLength,
  Matches,
  IsAlpha,
  IsUppercase,
} from 'class-validator';

export class CreateDocumentTypeDto {
  @IsDefined({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @IsAlpha('es-ES', { message: 'El nombre solo puede contener letras' })
  @Length(2, 50, { message: 'El nombre debe tener entre 2 y 50 caracteres' })
  name: string;

  @IsDefined({ message: 'La abreviación es requerida' })
  @IsString({ message: 'La abreviación debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'La abreviación no puede estar vacía' })
  @IsUppercase({ message: 'La abreviación debe estar en mayúsculas' })
  @Matches(/^[A-Z]+$/, {
    message: 'La abreviación solo debe contener letras mayúsculas sin espacios',
  })
  @MinLength(1, { message: 'La abreviación debe tener al menos 1 carácter' })
  @MaxLength(5, { message: 'La abreviación debe tener como máximo 5 caracteres' })
  abbreviation: string;
}
