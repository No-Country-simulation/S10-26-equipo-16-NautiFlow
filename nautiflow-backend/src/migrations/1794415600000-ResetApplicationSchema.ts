import { MigrationInterface, QueryRunner } from 'typeorm';
import { createInitialSchema, dropInitialSchema } from './initial-schema';

export class ResetApplicationSchema1794415600000
  implements MigrationInterface
{
  name = 'ResetApplicationSchema1794415600000';

  async up(queryRunner: QueryRunner): Promise<void> {
    if (process.env.ALLOW_DESTRUCTIVE_MIGRATION !== 'true') {
      throw new Error(
        'Set ALLOW_DESTRUCTIVE_MIGRATION=true to confirm resetting all NautiFlow tables and data.',
      );
    }

    await dropInitialSchema(queryRunner);
    await createInitialSchema(queryRunner);
  }

  async down(): Promise<void> {
    throw new Error(
      'The destructive schema reset cannot be reverted; restore a database backup instead.',
    );
  }
}
