import { ApiProperty } from '@nestjs/swagger';
import { IsEnum} from 'class-validator';
import { EmptyLegStatus } from '../entities/empty-leg.entity';

export class UpdateEmptyLegDto {
  @ApiProperty({
    description: 'Nuevo estado del tramo vacío',
    enum: EmptyLegStatus,
    example: EmptyLegStatus.ASSIGNED,
  })
  @IsEnum(EmptyLegStatus)
  estado: EmptyLegStatus;
}