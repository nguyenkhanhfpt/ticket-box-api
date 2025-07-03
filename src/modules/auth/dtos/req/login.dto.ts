import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '@database/entities/user.entity';

export class LoginDto {
  public static readonly resource = UserEntity.name;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
