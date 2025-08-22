import { Transform } from 'class-transformer';
import { IsNotEmpty, IsString, Length, Matches } from 'class-validator';
import { IsCuid } from '../../common/decorators/is-cuid.decorator';

export class CreateBranchDto {
  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  @IsString({ message: 'El nombre debe ser texto' })
  @IsNotEmpty({ message: 'El nombre no puede estar vacío' })
  @Length(2, 100, { message: 'El nombre debe tener entre 2 y 100 caracteres' })
  name: string;

  @Transform(({ value }) => value.trim().replace(/\s+/g, ' '))
  @IsString({ message: 'La dirección debe ser texto' })
  @IsNotEmpty({ message: 'La dirección no puede estar vacía' })
  @Length(5, 255, { message: 'La dirección debe tener entre 5 y 255 caracteres' })
  address: string;

  @Transform(({ value }) => value.replace(/\s+/g, ''))
  @Matches(/^\+?\d{7,15}$/, {
    message: 'Ingrese un número de teléfono válido (7 a 15 dígitos, opcional con +)',
  })
  phone: string;

  @IsCuid({ message: 'El ID de municipio no es válido' })
  municipalityId: string;
}
