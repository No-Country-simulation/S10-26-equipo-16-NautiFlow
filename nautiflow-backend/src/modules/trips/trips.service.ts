import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VerificationStatus } from '../boat-operators/entities/boat-operator.entity';
import { Boat } from '../boat-operators/entities/boat.entity';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { Trip, TripStatus } from './entities/trip.entity';

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
      const boat = await this.findBoatForAssignment(createTripDto.boatId);
      this.assertBoatCanServe(
        boat,
        createTripDto.pasajeros,
        createTripDto.zona,
      );
    }

    const trip = this.tripRepository.create(createTripDto);
    trip.estado = createTripDto.boatId
      ? TripStatus.ASSIGNED
      : TripStatus.PENDING;

    return this.tripRepository.save(trip);
  }

  async findAll(): Promise<Trip[]> {
    return this.tripRepository.find({ relations: { boat: true } });
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
    const targetBoatId = updateTripDto.boatId ?? trip.boatId;
    const targetPassengers = updateTripDto.pasajeros ?? trip.pasajeros;
    const targetZone = updateTripDto.zona ?? trip.zona;

    if (targetBoatId) {
      const boat = await this.findBoatForAssignment(targetBoatId);
      this.assertBoatCanServe(boat, targetPassengers, targetZone);
    }

    this.tripRepository.merge(trip, updateTripDto);
    if (targetBoatId && trip.estado === TripStatus.PENDING) {
      trip.estado = TripStatus.ASSIGNED;
    }
    return this.tripRepository.save(trip);
  }

  async assignBoat(tripId: string, boatId: string): Promise<Trip> {
    const trip = await this.findOne(tripId);
    const boat = await this.findBoatForAssignment(boatId);
    this.assertBoatCanServe(boat, trip.pasajeros, trip.zona);

    trip.boat = boat;
    trip.boatId = boatId;
    trip.estado = TripStatus.ASSIGNED;
    return this.tripRepository.save(trip);
  }

  async remove(id: string): Promise<void> {
    const trip = await this.findOne(id);
    await this.tripRepository.remove(trip);
  }

  private async findBoatForAssignment(boatId: string): Promise<Boat> {
    const boat = await this.boatRepository.findOne({
      where: { id: boatId },
      relations: { boatOperator: true },
    });
    if (!boat) {
      throw new NotFoundException(
        `La lancha con ID ${boatId} no fue encontrada`,
      );
    }
    return boat;
  }

  private assertBoatCanServe(
    boat: Boat,
    passengers: number,
    zone?: string | null,
  ): void {
    if (!boat.activa) {
      throw new BadRequestException(
        'La lancha seleccionada no se encuentra activa',
      );
    }
    if (boat.boatOperator?.estadoVerificacion !== VerificationStatus.VERIFIED) {
      throw new BadRequestException(
        'La lancha debe pertenecer a un operador verificado',
      );
    }
    if (boat.capacidad < passengers) {
      throw new BadRequestException(
        `La capacidad de la lancha (${boat.capacidad}) es insuficiente para los pasajeros (${passengers})`,
      );
    }
    if (zone && !boat.zonaCobertura.includes(zone)) {
      throw new BadRequestException(
        `La lancha no cubre la zona solicitada: ${zone}`,
      );
    }
  }
}
