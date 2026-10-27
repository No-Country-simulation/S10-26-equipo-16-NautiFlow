import { ApiProperty } from '@nestjs/swagger';
import { IsUUID } from 'class-validator';

export class IssueReviewTokenDto {
  @ApiProperty({ description: 'UUID del viaje que podrá reseñarse' })
  @IsUUID()
  tripId: string;
}
