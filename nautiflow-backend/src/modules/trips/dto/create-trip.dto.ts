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
  @IsString()
  @IsNotEmpty()
  origen: string;

  @IsString()
  @IsNotEmpty()
  destino: string;

  @IsDateString()
  @IsNotEmpty()
  fechaHoraSalida: string;

  @IsNumber()
  @Min(1)
  @IsNotEmpty()
  pasajeros: number;

  @IsEnum(TripStatus)
  @IsOptional()
  estado?: TripStatus;

  @IsUUID()
  @IsOptional()
  boatId?: string;
}