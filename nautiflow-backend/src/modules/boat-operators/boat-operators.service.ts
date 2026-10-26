import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { BoatOperator } from './entities/boat-operator.entity';
import { Boat } from './entities/boat.entity';
import { CreateBoatOperatorDto } from './dto/create-boat-operator.dto';
import { UpdateBoatOperatorDto } from './dto/update-boat-operator.dto';
import { CreateBoatDto } from './dto/create-boat.dto';

@Injectable()
export class BoatOperatorsService {
  constructor(
    @InjectRepository(BoatOperator)
    private readonly boatOperatorRepository: Repository<BoatOperator>,

    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
  ) {}

  async create(
    createBoatOperatorDto: CreateBoatOperatorDto,
  ): Promise<BoatOperator> {
    const boatOperator = this.boatOperatorRepository.create(
      createBoatOperatorDto,
    );
    return this.boatOperatorRepository.save(boatOperator);
  }

  async findAll(): Promise<BoatOperator[]> {
    return this.boatOperatorRepository.find({
      relations: { boats: true },
    });
  }

  async findOne(id: string): Promise<BoatOperator> {
    const boatOperator = await this.boatOperatorRepository.findOne({
      where: { id },
      relations: { boats: true },
    });

    if (!boatOperator) {
      throw new NotFoundException(
        `Operador de embarcación con ID ${id} no encontrado`,
      );
    }

    return boatOperator;
  }

  async update(
    id: string,
    updateBoatOperatorDto: UpdateBoatOperatorDto,
  ): Promise<BoatOperator> {
    const boatOperator = await this.findOne(id);

    this.boatOperatorRepository.merge(boatOperator, updateBoatOperatorDto);

    return this.boatOperatorRepository.save(boatOperator);
  }

  async remove(id: string): Promise<void> {
    const boatOperator = await this.findOne(id);
    await this.boatOperatorRepository.remove(boatOperator);
  }

  async createBoat(
    boatOperatorId: string,
    createBoatDto: CreateBoatDto,
  ): Promise<Boat> {
    const boatOperator = await this.boatOperatorRepository.findOneBy({
      id: boatOperatorId,
    });

    if (!boatOperator) {
      throw new NotFoundException(
        `Operador de embarcación con ID ${boatOperatorId} no encontrado`,
      );
    }

    const boat = this.boatRepository.create({
      ...createBoatDto,
      boatOperator,
      boatOperatorId: boatOperator.id,
    });

    return this.boatRepository.save(boat);
  }
}
