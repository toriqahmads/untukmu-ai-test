import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';

@ValidatorConstraint({ name: 'IsReferralCodeValid', async: true })
@Injectable()
export class IsReferralCodeValid implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async validate(referralCode: string, _args: ValidationArguments) {
    const user = await this.userService.findByReferralCode(referralCode);
    return !!user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} ${validationArguments.value} is not valid`;
  }
}

export function IsReferralCodeUserValid(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsReferralCodeValid,
    });
  };
}
