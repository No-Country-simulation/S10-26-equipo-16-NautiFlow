import { Injectable } from '@nestjs/common';
import { CreateLancheroDto } from './dto/create-lanchero.dto';
import { UpdateLancheroDto } from './dto/update-lanchero.dto';

@Injectable()
export class LancherosService {
  create(createLancheroDto: CreateLancheroDto) {
    return 'This action adds a new lanchero';
  }

  findAll() {
    return `This action returns all lancheros`;
  }

  findOne(id: number) {
    return `This action returns a #${id} lanchero`;
  }

  update(id: number, updateLancheroDto: UpdateLancheroDto) {
    return `This action updates a #${id} lanchero`;
  }

  remove(id: number) {
    return `This action removes a #${id} lanchero`;
  }
}
