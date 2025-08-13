import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';

/**
 * Valida que el valor sea un CUID válido.
 * Formato: Empieza con 'c' seguido de 24 caracteres alfanuméricos en minúscula.
 *
 * @param validationOptions Opciones de validación de class-validator.
 */
export function IsCuid(validationOptions?: ValidationOptions) {
  return function <T extends object>(object: T, propertyName: keyof T & string): void {
    registerDecorator({
      name: 'isCuid',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: {
        validate(value: unknown): value is string {
          return typeof value === 'string' && /^c[a-z0-9]{24}$/.test(value);
        },
        defaultMessage(args: ValidationArguments): string {
          return `${args.property} no es un CUID válido`;
        },
      },
    });
  };
}
