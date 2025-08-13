import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

/**
 * Valida que el valor de una propiedad coincida con otra propiedad del mismo objeto.
 *
 * @template T Tipo del objeto que contiene las propiedades.
 * @param property Propiedad con la que debe coincidir.
 * @param validationOptions Opciones de validación de class-validator.
 */
export function Match<T extends object>(property: keyof T, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string): void {
    registerDecorator({
      name: 'Match',
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: {
        validate(value: unknown, args: ValidationArguments): boolean {
          const [relatedPropertyName] = args.constraints as [keyof T];
          const relatedValue = (args.object as T)[relatedPropertyName];
          return value === relatedValue;
        },
        defaultMessage(args: ValidationArguments): string {
          const [relatedPropertyName] = args.constraints as [keyof T];
          return `${args.property} debe coincidir con ${String(relatedPropertyName)}`;
        },
      },
    });
  };
}
