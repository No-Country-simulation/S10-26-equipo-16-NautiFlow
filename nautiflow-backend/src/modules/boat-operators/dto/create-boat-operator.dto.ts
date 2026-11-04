import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsPhoneNumber,
  IsUrl,
} from 'class-validator';

import { VerificationStatus } from '../entities/boat-operator.entity';

export class CreateBoatOperatorDto {
  @ApiProperty({ example: 'Carlos Rodríguez' })
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @ApiProperty({
    example: '+573001234567',
    description:
      'Número de teléfono internacional con código de país. Ejemplo: +573001234567',
  })
  @IsPhoneNumber()
  telefono: string;

  @ApiPropertyOptional({
    example: 'https://res.cloudinary.com/.../licencia.pdf',
    description: 'Se asigna al cargar la licencia después de crear el operador.',
  })
  @IsUrl({ require_tld: false })
  @IsOptional()
  licenciaUrl?: string;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/antecedentes.pdf',
  })
  @IsUrl({ require_tld: false })
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
