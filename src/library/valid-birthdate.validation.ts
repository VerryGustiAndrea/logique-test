import { registerDecorator, ValidationOptions } from 'class-validator';
import validator from 'validator';

export function IsValidBirthDate(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'IsValidBirthDate',
      target: object.constructor,
      propertyName: propertyName,
      options: { message: 'Must be valid date with yyyy-mm-dd format' },
      validator: {
        validate(value: any) {
          return validator.isDate(value);
        },
      },
    });
  };
}
