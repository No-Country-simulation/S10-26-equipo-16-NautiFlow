import { PartialType } from '@nestjs/swagger';
import { CreateLancheroDto } from './create-lanchero.dto';

export class UpdateLancheroDto extends PartialType(CreateLancheroDto) {}
