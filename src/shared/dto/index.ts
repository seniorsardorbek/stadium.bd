import { Transform } from "class-transformer";
import { IsBoolean, IsInt, IsNotEmpty, IsOptional, Min, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";

export class Paginate {
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsInt()
  @Min(1)
  limit?: number;
}

export class Filter {
  @IsNotEmpty()
  @Transform(({ value }) => {
    if (value === "true") return true;
    else if (value === "false") return false;
    return value;
  })
  @IsBoolean()
  is_deleted: boolean;
}



@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const phoneNumberRegex = /^\+998(90|91|93|94|95|97|98|99|50|55|88|77|78|33|20)[0-9]{7}$/;
    return phoneNumberRegex.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must be a valid phone number for Uzbekistan (uz) region.`;
  }
}

export function IsPhoneNumber(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsPhoneNumberConstraint,
    });
  };
}


