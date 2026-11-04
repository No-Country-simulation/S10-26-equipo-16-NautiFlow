import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class CreateStorageDto {
  @ApiProperty({ example: 'boat-operator' })
  @IsString()
  @IsNotEmpty()
  entityType: string;

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  entityId: string;

  @ApiProperty({
    example: 'profile-photo',
    description: 'Tipo de archivo que se está almacenando',
  })
  @IsString()
  @IsNotEmpty()
  fileType: string;
}
