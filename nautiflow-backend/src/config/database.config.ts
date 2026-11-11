import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { CreateInitialSchema1794415500000 } from '../migrations/1794415500000-CreateInitialSchema';
import { ResetApplicationSchema1794415600000 } from '../migrations/1794415600000-ResetApplicationSchema';

export const getDatabaseConfig = (
  configService: ConfigService,
): TypeOrmModuleOptions => {
  const databaseUrl = configService.get<string>('DATABASE_URL');

  if (databaseUrl) {
    return {
      type: 'postgres',
      url: databaseUrl,
      autoLoadEntities: true,
      synchronize: false,
      migrations: [
        CreateInitialSchema1794415500000,
        ResetApplicationSchema1794415600000,
      ],
      uuidExtension: 'pgcrypto',
      ssl: {
        rejectUnauthorized: false,
      },
    };
  }

  // Configuración local
  return {
    type: 'postgres',
    host: configService.get<string>('DB_HOST'),
    port: configService.get<number>('DB_PORT', 5432),
    username: configService.get<string>('DB_USERNAME'),
    password: configService.get<string>('DB_PASSWORD'),
    database: configService.get<string>('DB_DATABASE'),
    autoLoadEntities: true,
    synchronize: true,
    migrations: [
      CreateInitialSchema1794415500000,
      ResetApplicationSchema1794415600000,
    ],
    uuidExtension: 'pgcrypto',
  };
};
