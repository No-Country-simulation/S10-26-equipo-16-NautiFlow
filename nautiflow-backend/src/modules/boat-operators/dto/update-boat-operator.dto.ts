import { PartialType } from '@nestjs/swagger';
import { CreateBoatOperatorDto } from './create-boat-operator.dto';

export class UpdateBoatOperatorDto extends PartialType(CreateBoatOperatorDto) {}
