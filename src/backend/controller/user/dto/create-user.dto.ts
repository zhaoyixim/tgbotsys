import { IsEmail, IsEnum, IsNotEmpty, MaxLength, MinLength } from 'class-validator';

import {
  USER_PASSWORD_MAX_LEN,
  USER_PASSWORD_MIN_LEN,
  USER_USERNAME_MAX_LEN,
  USER_USERNAME_MIN_LEN,
} from '../../../common/constants/user.const';
import { Role } from '../../../common/enums/role.enum';

export class CreateUserDto {

  @IsNotEmpty()
  public readonly username: string;

  @IsNotEmpty()
  public readonly password: string;

}