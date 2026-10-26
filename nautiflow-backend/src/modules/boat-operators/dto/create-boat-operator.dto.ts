import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
} from 'class-validator';

import { VerificationStatus } from '../entities/boat-operator.entity';

export class CreateBoatOperatorDto {
  @ApiProperty({ example: 'Carlos Rodríguez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({ example: '+573001234567' })
  @IsPhoneNumber('CO')
  telefono: string;

  @ApiProperty({ example: 'https://ejemplo.com/licencia.pdf' })
  @IsString()
  @IsNotEmpty()
  licenciaUrl: string;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/antecedentes.pdf',
  })
  @IsString()
  @IsOptional()
  antecedentesPenalesUrl?: string;

  @ApiPropertyOptional({
    enum: VerificationStatus,
    enumName: 'VerificationStatus',
  })
  @IsEnum(VerificationStatus)
  @IsOptional()
  estadoVerificacion?: VerificationStatus;
}
