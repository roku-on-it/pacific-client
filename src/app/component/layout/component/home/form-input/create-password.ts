import {
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
} from 'class-validator';

export class CreatePassword {
  @MaxLength(300)
  @IsNotEmpty({ message: 'Username should not be empty' })
  username: string;

  @MaxLength(300)
  @IsNotEmpty({ message: 'Password should not be empty' })
  password: string;

  @IsOptional()
  @MaxLength(2048, {
    message: 'Website URL must be shorter than or equal to 2048 characters',
  })
  @IsUrl({}, { message: 'Website URL must be a valid URL address' })
  uri: string;

  @IsOptional()
  @MaxLength(2048, {
    message: 'Icon URL must be shorter than or equal to 2048 characters',
  })
  @IsUrl({}, { message: 'Icon URL must be a valid URL address' })
  imageSrc: string;

  @IsOptional()
  @MaxLength(1000, {
    message: 'Description must be shorter than or equal to 1000 characters',
  })
  description: string;
}
