import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  Min,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from "class-validator";

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

@ValidatorConstraint({ name: "isPhoneNumber", async: false })
class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const phoneNumberRegex = /^\+\d{3}-\d{2}-\d{3}-\d{2}-\d{2}$/;
    ;
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
