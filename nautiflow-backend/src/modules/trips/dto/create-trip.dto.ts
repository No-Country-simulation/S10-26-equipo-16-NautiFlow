import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  Min,
  IsUUID,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { TripStatus } from '../entities/trip.entity';

export class CreateTripDto {
  @ApiProperty({
    description: 'Lugar de origen del viaje',
    example: 'Tigre Centro',
  })
  @IsString()
  @IsNotEmpty()
  origen: string;

  @ApiProperty({
    description: 'Lugar de destino del viaje',
    example: 'Primera Sección del Delta',
  })
  @IsString()
  @IsNotEmpty()
  destino: string;

  @ApiProperty({
    description: 'Fecha y hora programadas para la salida en formato ISO 8601',
    example: '2026-11-15T14:00:00-03:00',
    format: 'date-time',
  })
  @IsDateString()
  @IsNotEmpty()
  fechaHoraSalida: string;

  @ApiProperty({
    description: 'Cantidad de pasajeros del viaje',
    example: 5,
    minimum: 1,
    type: Number,
  })
  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pasajeros: number;

  @ApiPropertyOptional({
    description: 'Estado inicial o actual del viaje',
    enum: TripStatus,
    example: TripStatus.PENDING,
  })
  @IsEnum(TripStatus)
  @IsOptional()
  estado?: TripStatus;

  @ApiPropertyOptional({
    description: 'Identificador UUID de la lancha asignada al viaje',
    example: '550e8400-e29b-41d4-a716-446655440000',
    format: 'uuid',
  })
  @IsUUID()
  @IsOptional()
  boatId?: string;
}
