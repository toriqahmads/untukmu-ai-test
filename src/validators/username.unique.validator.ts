import {
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
  registerDecorator,
} from 'class-validator';
import { Injectable } from '@nestjs/common';
import { UserService } from 'src/modules/users/user.service';

@ValidatorConstraint({ name: 'IsUsernameAlreadyExist', async: true })
@Injectable()
export class IsUsernameAlreadyExist implements ValidatorConstraintInterface {
  constructor(protected readonly userService: UserService) {}

  async validate(username: string, args: ValidationArguments) {
    const ctx = args.object['context'];
    const user = await this.userService.isUsernameExist(
      username,
      ctx?.params?.id,
    );
    return !user;
  }

  defaultMessage(validationArguments?: ValidationArguments): string {
    return `${validationArguments.property} ${validationArguments.value} already exist`;
  }
}

export function IsUsernameUserAlreadyExist(
  validationOptions?: ValidationOptions,
) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyExist,
    });
  };
}
