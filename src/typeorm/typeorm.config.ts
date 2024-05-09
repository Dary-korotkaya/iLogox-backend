import { DataSource, DataSourceOptions } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
import * as process from 'process';
import { join } from 'path';

config({ path: join(process.cwd(), '.env') });
const configService = new ConfigService();

const options = (): DataSourceOptions => {
  const url = configService.get('DATABASE_URL');
  if (!url) {
    throw new Error('Database url not found');
  }
  return {
    url: url,
    type: 'postgres',
    logging: false,
    entities: [join(__dirname, '**', '*.entity{.ts,.js}')],
    migrations: ['dist/migrations/*.{ts,js}'],
    synchronize: true,
  };
};
export const appDataSource = new DataSource(options());
