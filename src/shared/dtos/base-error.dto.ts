import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class BaseErrorDto {
  @ApiProperty()
  @Expose()
  code: string;

  @ApiProperty()
  @Expose()
  message?: string;
}
