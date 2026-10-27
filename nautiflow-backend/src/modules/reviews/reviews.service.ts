import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { randomUUID } from 'crypto';
import { DataSource, EntityManager, IsNull, Repository } from 'typeorm';
import { Trip } from '../trips/entities/trip.entity';
import { Boat } from '../boat-operators/entities/boat.entity';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { Review } from './entities/review.entity';
import { ReviewToken } from './entities/review-token.entity';

@Injectable()
export class ReviewsService {
  constructor(
    @InjectRepository(Review) private readonly reviews: Repository<Review>,
    @InjectRepository(ReviewToken)
    private readonly tokens: Repository<ReviewToken>,
    @InjectRepository(Trip) private readonly trips: Repository<Trip>,
    private readonly dataSource: DataSource,
  ) {}

  async issueToken(tripId: string): Promise<{ token: string }> {
    const trip = await this.trips.findOne({ where: { id: tripId } });
    if (!trip) throw new NotFoundException(`Viaje ${tripId} no encontrado`);
    const token = randomUUID();
    await this.tokens.save(this.tokens.create({ token, tripId }));
    return { token };
  }

  async create(dto: CreateReviewDto): Promise<Review> {
    return this.dataSource.transaction(async (manager) => {
      const tokenRepo = manager.getRepository(ReviewToken);
      const token = await tokenRepo.findOne({ where: { token: dto.token } });
      if (!token) throw new NotFoundException('Token de reseña inválido');
      if (token.usedAt)
        throw new BadRequestException('El token ya fue utilizado');

      const claim = await tokenRepo.update(
        { id: token.id, usedAt: IsNull() },
        { usedAt: new Date() },
      );
      if (!claim.affected)
        throw new BadRequestException('El token ya fue utilizado');

      const review = await manager.getRepository(Review).save(
        manager.getRepository(Review).create({
          rating: dto.rating,
          comment: dto.comment,
          tripId: token.tripId,
        }),
      );

      const trip = await manager.getRepository(Trip).findOne({
        where: { id: token.tripId },
        select: { id: true, boatId: true },
      });

      if (trip?.boatId) {
        await this.recalculateBoatAverage(manager, trip.boatId);
      }

      return review;
    });
  }

  private async recalculateBoatAverage(
    manager: EntityManager,
    boatId: string,
  ): Promise<void> {
    const result = await manager
      .getRepository(Review)
      .createQueryBuilder('review')
      .innerJoin(Trip, 'trip', 'trip.id = review.tripId')
      .select('AVG(review.rating)', 'average')
      .where('trip.boatId = :boatId', { boatId })
      .getRawOne<{ average: string | null }>();

    await manager.getRepository(Boat).update(boatId, {
      promedioCalificaciones: Number(result?.average ?? 0),
    });
  }

  findAll(): Promise<Review[]> {
    return this.reviews.find({
      relations: { trip: true },
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Review> {
    const review = await this.reviews.findOne({
      where: { id },
      relations: { trip: true },
    });
    if (!review) throw new NotFoundException(`Reseña ${id} no encontrada`);
    return review;
  }

  async update(id: string, dto: UpdateReviewDto): Promise<Review> {
    const review = await this.findOne(id);
    if (dto.rating !== undefined) review.rating = dto.rating;
    if (dto.comment !== undefined) review.comment = dto.comment;
    return this.reviews.save(review);
  }

  async remove(id: string): Promise<void> {
    const review = await this.findOne(id);
    await this.reviews.remove(review);
  }
}
