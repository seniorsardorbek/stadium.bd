import {
  ValidationArguments,
  ValidationOptions,
  registerDecorator,
} from "class-validator";

export function IsInDynamicArray(
  property: string,
  validValues: string[],
  validationOptions?: ValidationOptions,
) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "isInDynamicArray",
      target: object.constructor,
      propertyName: propertyName,
      constraints: [property, validValues],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const [relatedPropertyName, validValues] = args.constraints;
          const relatedValue = (args.object as any)[relatedPropertyName];
          return validValues.includes(value) && relatedValue.includes(value);
        },
      },
    });
  };
}
