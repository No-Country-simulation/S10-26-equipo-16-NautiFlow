import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, Max, Min } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty({
    description: 'Calificación del viaje, entre 1 y 5 estrellas',
    example: 5,
    minimum: 1,
    maximum: 5,
    type: Number,
  })
  @IsInt()
  @Min(1)
  @Max(5)
  rating: number;

  @ApiPropertyOptional({
    description: 'Comentario del turista sobre su experiencia',
    example: 'Excelente servicio, puntualidad y buena atención.',
    type: String,
  })
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  comment?: string;

  @ApiProperty({
    description: 'Token de un solo uso entregado al turista',
    format: 'uuid',
  })
  @IsUUID()
  token: string;
}
