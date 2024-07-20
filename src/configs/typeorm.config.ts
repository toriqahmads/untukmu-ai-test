import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { DataSource, DataSourceOptions } from 'typeorm';
import { config } from 'dotenv';
config({ path: `${__dirname}/../../.env` });

export const TypeOrmModuleOption: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database/untukmu',
  entities: [__dirname + '/../**/entities/*.entity.{ts,js}'],
  synchronize: true,
  autoLoadEntities: true,
  logging: true,
};

export default new DataSource(TypeOrmModuleOption as DataSourceOptions);
