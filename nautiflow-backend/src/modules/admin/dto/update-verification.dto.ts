import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { VerificationStatus } from '../../boat-operators/entities/boat-operator.entity';

export class UpdateVerificationDto {
  @ApiProperty({
    description: 'Nuevo estado de verificación para el operador',
    enum: VerificationStatus,
    example: VerificationStatus.VERIFIED,
  })
  @IsEnum(VerificationStatus, { message: 'El estado debe ser un valor válido de verificación (VERIFIED, REJECTED)' })
  @IsNotEmpty()
  estadoVerificacion: VerificationStatus;
}