import { MigrationInterface, QueryRunner } from 'typeorm';
import { createInitialSchema, dropInitialSchema } from './initial-schema';

export class CreateInitialSchema1794415500000
  implements MigrationInterface
{
  name = 'CreateInitialSchema1794415500000';

  async up(queryRunner: QueryRunner): Promise<void> {
    await createInitialSchema(queryRunner);
  }

  async down(queryRunner: QueryRunner): Promise<void> {
    await dropInitialSchema(queryRunner);
  }
}
