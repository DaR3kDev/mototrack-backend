import { registerDecorator, ValidationArguments, ValidationOptions } from 'class-validator';

export function Match<T>(property: keyof T, validationOptions?: ValidationOptions) {
  return function (object: T, propertyName: string) {
    registerDecorator({
      name: 'Match',
      target: Object.getPrototypeOf(object),
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
          const [relatedPropertyName] = args.constraints as [string];
          return `${propertyName} debe coincidir con ${relatedPropertyName}`;
        },
      },
    });
  };
}
