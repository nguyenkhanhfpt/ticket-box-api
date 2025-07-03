import { registerAs } from '@nestjs/config';
import { join } from 'path';
import { TypeOrmLoggerContainer } from '@shared/logger/typeorm.logger';

export default registerAs('database', () => ({
  type: process.env.DATABASE_DRIVER,
  host: process.env.DATABASE_HOST,
  port: parseInt(process.env.DATABASE_PORT, 10) || 5432,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: process.env.DATABASE_SYNCHRONIZE === 'true',
  autoLoadEntities: process.env.DATABASE_AUTOLOAD === 'true',
  entities: [join(__dirname, '../database/entities/*.entity{.ts,.js}')],
  logger: TypeOrmLoggerContainer.ForConnection('CONNECTION', 'all'),
}));
