import { DataSourceOptions } from 'typeorm';

const isDevelopment = process.env.NODE_ENV === 'development';

export const databaseConfig: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'formulaone',
  synchronize: isDevelopment, // Set to false in production
  logging: isDevelopment,
  ssl: !isDevelopment ? {
    rejectUnauthorized: false // Required for some providers like Heroku
  } : false,
  entities: ['src/entities/**/*.ts'],
  migrations: ['src/migrations/**/*.ts'],
};

export default databaseConfig; 