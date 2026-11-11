import { QueryRunner } from 'typeorm';

export async function createInitialSchema(
  queryRunner: QueryRunner,
): Promise<void> {
  await queryRunner.query(`
    DO $$ BEGIN
      CREATE TYPE "lancheros_estadoverificacion_enum"
        AS ENUM ('PENDING', 'VERIFIED', 'REJECTED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `);
  await queryRunner.query(`
    DO $$ BEGIN
      CREATE TYPE "trips_estado_enum"
        AS ENUM ('PENDING', 'ASSIGNED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `);
  await queryRunner.query(`
    DO $$ BEGIN
      CREATE TYPE "empty_legs_estado_enum"
        AS ENUM ('AVAILABLE', 'ASSIGNED', 'COMPLETED', 'CANCELLED');
    EXCEPTION WHEN duplicate_object THEN NULL;
    END $$
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "lancheros" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "nombre" character varying(100) NOT NULL,
      "telefono" character varying(150) NOT NULL,
      "fotoPerfilUrl" text,
      "fotoPerfilPublicId" character varying(255),
      "licenciaUrl" character varying,
      "licenciaPublicId" character varying(255),
      "antecedentesPenalesUrl" character varying,
      "antecedentesPenalesPublicId" character varying(255),
      "estadoVerificacion" "lancheros_estadoverificacion_enum" NOT NULL DEFAULT 'PENDING',
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_lancheros_id" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_lancheros_telefono" UNIQUE ("telefono")
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "boats" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "nombreEmbarcacion" character varying(100) NOT NULL,
      "capacidad" integer NOT NULL,
      "zonaCobertura" text NOT NULL,
      "seguroUrl" character varying,
      "seguroPublicId" character varying(255),
      "fotosUrl" text,
      "fotos" jsonb DEFAULT '[]'::jsonb,
      "activa" boolean NOT NULL DEFAULT true,
      "promedioCalificaciones" numeric(3,2) NOT NULL DEFAULT '0',
      "lancheroId" uuid NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_boats_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_boats_lancheroId" FOREIGN KEY ("lancheroId")
        REFERENCES "lancheros"("id") ON DELETE CASCADE
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "trips" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "origen" character varying(150) NOT NULL,
      "destino" character varying(150) NOT NULL,
      "zona" character varying(80),
      "fechaHoraSalida" TIMESTAMP NOT NULL,
      "pasajeros" integer NOT NULL,
      "estado" "trips_estado_enum" NOT NULL DEFAULT 'PENDING',
      "boatId" uuid,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_trips_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_trips_boatId" FOREIGN KEY ("boatId")
        REFERENCES "boats"("id") ON DELETE SET NULL
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "empty_legs" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "lancha_id" uuid NOT NULL,
      "zona_origen" character varying(150) NOT NULL,
      "zona_destino" character varying(150) NOT NULL,
      "hora_salida" TIMESTAMP WITH TIME ZONE NOT NULL,
      "estado" "empty_legs_estado_enum" NOT NULL DEFAULT 'AVAILABLE',
      "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
      CONSTRAINT "PK_empty_legs_id" PRIMARY KEY ("id"),
      CONSTRAINT "FK_empty_legs_lancha_id" FOREIGN KEY ("lancha_id")
        REFERENCES "boats"("id")
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "reviews" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "rating" integer NOT NULL,
      "comment" text NOT NULL,
      "tripId" uuid NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_reviews_id" PRIMARY KEY ("id"),
      CONSTRAINT "CHK_reviews_rating_range" CHECK ("rating" >= 1 AND "rating" <= 5),
      CONSTRAINT "FK_reviews_tripId" FOREIGN KEY ("tripId")
        REFERENCES "trips"("id") ON DELETE CASCADE
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "review_tokens" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "token" uuid NOT NULL,
      "tripId" uuid NOT NULL,
      "usedAt" TIMESTAMP,
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_review_tokens_id" PRIMARY KEY ("id"),
      CONSTRAINT "UQ_review_tokens_token" UNIQUE ("token"),
      CONSTRAINT "FK_review_tokens_tripId" FOREIGN KEY ("tripId")
        REFERENCES "trips"("id") ON DELETE CASCADE
    )
  `);

  await queryRunner.query(`
    CREATE TABLE IF NOT EXISTS "storage" (
      "id" uuid NOT NULL DEFAULT gen_random_uuid(),
      "entityType" character varying(50) NOT NULL,
      "entityId" uuid NOT NULL,
      "fileType" character varying(50) NOT NULL,
      "url" text NOT NULL,
      "publicId" character varying(255) NOT NULL,
      "resourceType" character varying(20) NOT NULL DEFAULT 'image',
      "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
      "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
      CONSTRAINT "PK_storage_id" PRIMARY KEY ("id")
    )
  `);

  await queryRunner.query(`
    CREATE INDEX IF NOT EXISTS "IDX_storage_entityType_entityId"
      ON "storage" ("entityType", "entityId")
  `);
}

export async function dropInitialSchema(
  queryRunner: QueryRunner,
): Promise<void> {
  await queryRunner.query('DROP TABLE IF EXISTS "storage" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "review_tokens" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "reviews" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "empty_legs" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "trips" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "boats" CASCADE');
  await queryRunner.query('DROP TABLE IF EXISTS "lancheros" CASCADE');
  await queryRunner.query('DROP TYPE IF EXISTS "empty_legs_estado_enum"');
  await queryRunner.query('DROP TYPE IF EXISTS "trips_estado_enum"');
  await queryRunner.query(
    'DROP TYPE IF EXISTS "lancheros_estadoverificacion_enum"',
  );
}
