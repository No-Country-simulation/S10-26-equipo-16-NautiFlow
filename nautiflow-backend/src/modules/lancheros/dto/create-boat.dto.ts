import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateBoatDto {
  @ApiProperty({
    example: 'Delta Express I',
    description: 'Nombre de la embarcación',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  nombreEmbarcacion: string;

  @ApiProperty({
    example: 5,
    description: 'Capacidad máxima de pasajeros',
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  capacidad: number;

  @ApiProperty({
    example: 'Cartagena',
    description: 'Zona de cobertura de la embarcación',
  })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  zonaCobertura: string;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/seguro.pdf',
    description: 'URL del comprobante de seguro',
  })
  @IsOptional()
  @IsUrl({ require_tld: false })
  seguroUrl?: string;

  @ApiPropertyOptional({
    example: 'https://ejemplo.com/lancha.jpg',
    description: 'URL o contenido definido para las fotografías',
  })
  @IsOptional()
  @IsString()
  fotosUrl?: string;

  @ApiPropertyOptional({
    example: true,
    description: 'Indica si la embarcación está activa',
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  activa?: boolean;
}
