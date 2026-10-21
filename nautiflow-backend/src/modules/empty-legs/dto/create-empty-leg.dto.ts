import { ApiProperty } from '@nestjs/swagger';
import {
  IsDateString,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';

export class CreateEmptyLegDto {
  @ApiProperty({
    description: 'ID único de la lancha asociada',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsUUID()
  @IsNotEmpty()
  lanchaId: string;

  @ApiProperty({
    description: 'Zona de origen del trayecto',
    example: 'Muelle Principal',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  zonaOrigen: string;

  @ApiProperty({
    description: 'Zona de destino del trayecto',
    example: 'Isla del Sol',
    minLength: 2,
    maxLength: 150,
  })
  @IsString()
  @IsNotEmpty()
  @Length(2, 150)
  zonaDestino: string;

  @ApiProperty({
    description: 'Fecha y hora de salida programada',
    example: '2026-10-20T08:00:00.000Z',
  })
  @IsDateString()
  @IsNotEmpty()
  horaSalida: string;
}
