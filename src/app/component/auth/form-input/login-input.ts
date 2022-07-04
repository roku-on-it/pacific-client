import {
  IsEmail,
  Length,
  Matches,
  Validate,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@ValidatorConstraint()
export class EqualWith implements ValidatorConstraintInterface {
  validate(value: string, validationArguments: ValidationArguments) {
    return (
      validationArguments.value ===
      validationArguments.object[validationArguments.constraints[0]]
    );
  }
}

export class LoginInput {
  @IsEmail({}, { message: 'Must be a valid email' })
  email: string;

  @Length(12, 128, { message: 'Must be between 12 and 128 characters' })
  @Matches(/(.*[a-z].*)/, {
    message: 'Must include at least one lowercase letter',
  })
  @Matches(/(.*[A-Z].*)/, {
    message: 'Must include at least one uppercase letter',
  })
  @Matches(/(.*\W.*)/, {
    message: 'Must include at least one symbol',
  })
  @Matches(/\d/, { message: 'Must include at least one number' })
  masterPassword: string;

  @Validate(EqualWith, ['masterPassword'], {
    message: 'Passwords does not match',
  })
  confirmMasterPassword: string;
}
