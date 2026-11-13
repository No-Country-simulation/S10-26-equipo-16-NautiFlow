import { NestFactory } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { AppModule } from '../app.module';

async function runMigrations(): Promise<void> {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['error', 'warn', 'log'],
  });

  try {
    const dataSource = app.get(DataSource);
    const migrations = await dataSource.runMigrations();

    if (migrations.length === 0) {
      console.info('No pending database migrations.');
      return;
    }

    for (const migration of migrations) {
      console.info(`Applied database migration: ${migration.name}`);
    }
  } finally {
    await app.close();
  }
}

runMigrations().catch((error: unknown) => {
  console.error('Database migrations failed.', error);
  process.exitCode = 1;
});
