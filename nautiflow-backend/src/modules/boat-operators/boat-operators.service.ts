import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoatOperator } from './entities/boat-operator.entity';
import { Boat } from './entities/boat.entity';
import { CreateBoatOperatorDto } from './dto/create-boat-operator.dto';
import { UpdateBoatOperatorDto } from './dto/update-boat-operator.dto';
import { CreateBoatDto } from './dto/create-boat.dto';
import { UpdateBoatDto } from './dto/update-boat.dto';

@Injectable()
export class BoatOperatorsService {
  constructor(
    @InjectRepository(BoatOperator)
    private readonly boatOperatorRepository: Repository<BoatOperator>,
    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
  ) {}

  async create(dto: CreateBoatOperatorDto): Promise<BoatOperator> {
    return this.boatOperatorRepository.save(
      this.boatOperatorRepository.create(dto),
    );
  }

  async findAll(): Promise<BoatOperator[]> {
    return this.boatOperatorRepository.find({ relations: { boats: true } });
  }

  async findOne(id: string): Promise<BoatOperator> {
    const operator = await this.boatOperatorRepository.findOne({
      where: { id },
      relations: { boats: true },
    });
    if (!operator) {
      throw new NotFoundException(
        `Operador de embarcación con ID ${id} no encontrado`,
      );
    }
    return operator;
  }

  async update(id: string, dto: UpdateBoatOperatorDto): Promise<BoatOperator> {
    const operator = await this.findOne(id);
    this.boatOperatorRepository.merge(operator, dto);
    return this.boatOperatorRepository.save(operator);
  }

  async remove(id: string): Promise<void> {
    const operator = await this.findOne(id);
    await this.boatOperatorRepository.remove(operator);
  }

  async createBoat(operatorId: string, dto: CreateBoatDto): Promise<Boat> {
    const operator = await this.boatOperatorRepository.findOneBy({
      id: operatorId,
    });
    if (!operator) {
      throw new NotFoundException(
        `Operador de embarcación con ID ${operatorId} no encontrado`,
      );
    }
    
    const boat = this.boatRepository.create(dto);
    boat.boatOperator = operator;
    boat.boatOperatorId = operator.id;

    return this.boatRepository.save(boat);
  }

  async findBoatsByOperator(operatorId: string): Promise<Boat[]> {
    const operator = await this.boatOperatorRepository.findOneBy({
      id: operatorId,
    });
    if (!operator) {
      throw new NotFoundException(
        `Operador de embarcación con ID ${operatorId} no encontrado`,
      );
    }
    return this.boatRepository.find({ where: { boatOperatorId: operatorId } });
  }

  async findBoat(id: string): Promise<Boat> {
    const boat = await this.boatRepository.findOneBy({ id });
    if (!boat) {
      throw new NotFoundException(`Embarcación con ID ${id} no encontrada`);
    }
    return boat;
  }

  async updateBoat(id: string, dto: UpdateBoatDto): Promise<Boat> {
    const boat = await this.findBoat(id);
    this.boatRepository.merge(boat, dto);
    return this.boatRepository.save(boat);
  }

  async removeBoat(id: string): Promise<void> {
    const boat = await this.findBoat(id);
    await this.boatRepository.remove(boat);
  }
}
