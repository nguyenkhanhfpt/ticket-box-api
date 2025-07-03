import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

import { ErrorDto } from './error.dto';

export class BadRequestErrorDto extends ErrorDto {
  @ApiProperty()
  @Expose()
  readonly field: string;
}
