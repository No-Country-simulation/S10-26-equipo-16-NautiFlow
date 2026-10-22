import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Trip, TripStatus } from './entities/trip.entity';
import { Boat } from '../lancheros/entities/boat.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

@Injectable()
export class TripsService {
  constructor(
    @InjectRepository(Trip)
    private readonly tripRepository: Repository<Trip>,
    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
  ) {}

  async create(createTripDto: CreateTripDto): Promise<Trip> {

    if (createTripDto.boatId) {
      const boat = await this.boatRepository.findOne({
        where: { id: createTripDto.boatId },
      });

      if (!boat) {
        throw new NotFoundException(`La lancha con ID ${createTripDto.boatId} no fue encontrada`);
      }
      if (!boat.activa) {
        throw new BadRequestException('La lancha seleccionada no se encuentra activa');
      }
      if (boat.capacidad < createTripDto.pasajeros) {
        throw new BadRequestException(
          `La capacidad de la lancha (${boat.capacidad}) es menor que el número de pasajeros (${createTripDto.pasajeros})`,
        );
      }
    }

    const trip = this.tripRepository.create({
      ...createTripDto,
      estado: createTripDto.boatId ? TripStatus.ASSIGNED : TripStatus.PENDING,
    });

    return await this.tripRepository.save(trip);
  }

  async findAll(): Promise<Trip[]> {
    return await this.tripRepository.find({
      relations: { boat: true },
    });
  }

  async findOne(id: string): Promise<Trip> {
    const trip = await this.tripRepository.findOne({
      where: { id },
      relations: { boat: true },
    });

    if (!trip) {
      throw new NotFoundException(`El viaje con ID ${id} no fue encontrado`);
    }

    return trip;
  }

  async update(id: string, updateTripDto: UpdateTripDto): Promise<Trip> {
    const trip = await this.findOne(id);

    const targetBoatId = updateTripDto.boatId !== undefined ? updateTripDto.boatId : trip.boatId;
    const targetPassengers = updateTripDto.pasajeros !== undefined ? updateTripDto.pasajeros : trip.pasajeros;

    if (targetBoatId) {
      const boat = await this.boatRepository.findOne({
        where: { id: targetBoatId },
      });

      if (!boat) {
        throw new NotFoundException(`La lancha con ID ${targetBoatId} no fue encontrada`);
      }
      if (!boat.activa) {
        throw new BadRequestException('La lancha seleccionada no se encuentra activa');
      }
      if (boat.capacidad < targetPassengers) {
        throw new BadRequestException(
          `La capacidad de la lancha (${boat.capacidad}) es insuficiente para los pasajeros (${targetPassengers})`,
        );
      }
    }

    this.tripRepository.merge(trip, updateTripDto);

    if (targetBoatId && trip.estado === TripStatus.PENDING) {
      trip.estado = TripStatus.ASSIGNED;
    }

    return await this.tripRepository.save(trip);
  }

  async assignBoat(tripId: string, boatId: string): Promise<Trip> {
    const trip = await this.findOne(tripId);
    const boat = await this.boatRepository.findOne({ where: { id: boatId } });

    if (!boat) {
      throw new NotFoundException(`La lancha con ID ${boatId} no fue encontrada`);
    }
    if (!boat.activa) {
      throw new BadRequestException('La lancha seleccionada no se encuentra activa');
    }
    if (boat.capacidad < trip.pasajeros) {
      throw new BadRequestException(
        `La capacidad de la lancha (${boat.capacidad}) es menor que los pasajeros del viaje (${trip.pasajeros})`,
      );
    }

    trip.boat = boat;
    trip.boatId = boatId;
    trip.estado = TripStatus.ASSIGNED;

    return await this.tripRepository.save(trip);
  }

  async remove(id: string): Promise<void> {
    const trip = await this.findOne(id);
    await this.tripRepository.remove(trip);
  }
}