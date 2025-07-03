import { IsNotEmpty } from 'class-validator';
import { UserEntity } from '@database/entities/user.entity';

export class RegisterDto {
  public static resource = UserEntity.name;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  email: string;

  @IsNotEmpty()
  password: string;
}
