import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Lanchero } from './entities/lanchero.entity';
import { CreateLancheroDto } from './dto/create-lanchero.dto';
import { UpdateLancheroDto } from './dto/update-lanchero.dto';

@Injectable()
export class LancherosService {
  constructor(
    @InjectRepository(Lanchero)
    private readonly lancheroRepository: Repository<Lanchero>,
  ) {}

  async create(createLancheroDto: CreateLancheroDto): Promise<Lanchero> {
    const lanchero = this.lancheroRepository.create(createLancheroDto);
    return await this.lancheroRepository.save(lanchero);
  }

  async findAll(): Promise<Lanchero[]> {
    return await this.lancheroRepository.find({
      relations: { boats: true },
    });
  }

  async findOne(id: string): Promise<Lanchero> {
    const lanchero = await this.lancheroRepository.findOne({
      where: { id },
      relations: { boats: true },
    });

    if (!lanchero) {
      throw new NotFoundException(`Lanchero con ID ${id} no encontrado`);
    }

    return lanchero;
  }

  async update(
    id: string,
    updateLancheroDto: UpdateLancheroDto,
  ): Promise<Lanchero> {
    const lanchero = await this.findOne(id);
    this.lancheroRepository.merge(lanchero, updateLancheroDto);
    return await this.lancheroRepository.save(lanchero);
  }

  async remove(id: string): Promise<void> {
    const lanchero = await this.findOne(id);
    await this.lancheroRepository.remove(lanchero);
  }
}
