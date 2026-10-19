import { IsEnum, IsNotEmpty, IsOptional, IsString, IsPhoneNumber } from 'class-validator';
import { VerificationStatus } from '../entities/lanchero.entity';

export class CreateLancheroDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsNotEmpty()
  licenciaUrl: string;

  @IsString()
  @IsOptional()
  antecedentesPenalesUrl?: string;

  @IsEnum(VerificationStatus)
  @IsOptional()
  estadoVerificacion?: VerificationStatus;
}