import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsUUID } from 'class-validator';

export class AssignBoatDto {
  @ApiProperty({
    description: 'UUID de la lancha que se asignará al viaje',
    example: '776c1e7f-b5d4-4ba8-8b14-317f50ec37b4',
  })
  @IsUUID()
  @IsNotEmpty()
  boatId: string;
}
