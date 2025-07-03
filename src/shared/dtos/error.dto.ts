import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { BaseErrorDto } from './base-error.dto';

export class ErrorDto extends BaseErrorDto {
  @ApiProperty()
  @Expose()
  readonly resource: string;
}
