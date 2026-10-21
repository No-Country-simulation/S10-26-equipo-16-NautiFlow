import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Lanchero } from './entities/lanchero.entity';
import { Boat } from './entities/boat.entity';
import { CreateLancheroDto } from './dto/create-lanchero.dto';
import { UpdateLancheroDto } from './dto/update-lanchero.dto';
import { CreateBoatDto } from './dto/create-boat.dto';

@Injectable()
export class LancherosService {
  constructor(
    @InjectRepository(Lanchero)
    private readonly lancheroRepository: Repository<Lanchero>,

    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
  ) {}

  async create(createLancheroDto: CreateLancheroDto): Promise<Lanchero> {
    const lanchero = this.lancheroRepository.create(createLancheroDto);
    return this.lancheroRepository.save(lanchero);
  }

  async findAll(): Promise<Lanchero[]> {
    return this.lancheroRepository.find({
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

    return this.lancheroRepository.save(lanchero);
  }

  async remove(id: string): Promise<void> {
    const lanchero = await this.findOne(id);
    await this.lancheroRepository.remove(lanchero);
  }

  // Registrar una embarcación para un lanchero existente
  async createBoat(
    lancheroId: string,
    createBoatDto: CreateBoatDto,
  ): Promise<Boat> {
    const lanchero = await this.lancheroRepository.findOneBy({
      id: lancheroId,
    });

    if (!lanchero) {
      throw new NotFoundException(
        `Lanchero con ID ${lancheroId} no encontrado`,
      );
    }

    const boat = this.boatRepository.create({
      ...createBoatDto,
      lanchero,
      lancheroId: lanchero.id,
    });

    return this.boatRepository.save(boat);
  }
}
