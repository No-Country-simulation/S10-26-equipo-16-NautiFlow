import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { EmptyLeg, EmptyLegStatus } from './entities/empty-leg.entity';
import { Boat } from '../lancheros/entities/boat.entity';
import { CreateEmptyLegDto } from './dto/create-empty-leg.dto';
import { UpdateEmptyLegDto } from './dto/update-empty-leg.dto';

@Injectable()
export class EmptyLegsService {
  constructor(
    @InjectRepository(EmptyLeg)
    private readonly emptyLegRepository: Repository<EmptyLeg>,

    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
  ) {}

  // Registrar un nuevo tramo vacío
  async create(createEmptyLegDto: CreateEmptyLegDto): Promise<EmptyLeg> {
    const { lanchaId, zonaOrigen, zonaDestino, horaSalida } = createEmptyLegDto;

    if (zonaOrigen.trim() === zonaDestino.trim()) {
      throw new BadRequestException(
        'El origen y el destino deben ser diferentes.',
      );
    }

    const departureDate = new Date(horaSalida);

    if (Number.isNaN(departureDate.getTime()) || departureDate <= new Date()) {
      throw new BadRequestException(
        'La fecha de salida debe ser válida y futura.',
      );
    }

    const boat = await this.boatRepository.findOneBy({
      id: lanchaId,
    });

    if (!boat) {
      throw new NotFoundException(
        `No se encontró la lancha con ID ${lanchaId}.`,
      );
    }

    const emptyLeg = this.emptyLegRepository.create({
      zonaOrigen,
      zonaDestino,
      horaSalida: departureDate,
      estado: EmptyLegStatus.AVAILABLE,
      boat,
    });

    return this.emptyLegRepository.save(emptyLeg);
  }

  // Consultar los tramos disponibles
  async findAll(): Promise<EmptyLeg[]> {
    return this.emptyLegRepository.find({
      where: {
        estado: EmptyLegStatus.AVAILABLE,
      },
      relations: {
        boat: true,
      },
      order: {
        horaSalida: 'ASC',
      },
    });
  }

  // Consultar un tramo por su UUID
  async findOne(id: string): Promise<EmptyLeg> {
    const emptyLeg = await this.emptyLegRepository.findOne({
      where: { id },
      relations: {
        boat: true,
      },
    });

    if (!emptyLeg) {
      throw new NotFoundException(
        `No se encontró el tramo vacío con ID ${id}.`,
      );
    }

    return emptyLeg;
  }

  // Actualizar el estado del tramo
  async update(
    id: string,
    updateEmptyLegDto: UpdateEmptyLegDto,
  ): Promise<EmptyLeg> {
    const emptyLeg = await this.findOne(id);

    if (
      emptyLeg.estado === EmptyLegStatus.COMPLETED ||
      emptyLeg.estado === EmptyLegStatus.CANCELLED
    ) {
      throw new BadRequestException(
        'No se puede modificar un tramo finalizado o cancelado.',
      );
    }

    emptyLeg.estado = updateEmptyLegDto.estado;

    return this.emptyLegRepository.save(emptyLeg);
  }
}
