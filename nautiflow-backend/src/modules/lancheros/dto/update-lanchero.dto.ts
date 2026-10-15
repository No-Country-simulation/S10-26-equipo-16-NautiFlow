import { PartialType } from '@nestjs/mapped-types';
import { CreateLancheroDto } from './create-lanchero.dto';

export class UpdateLancheroDto extends PartialType(CreateLancheroDto) {}
