import { Module } from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { ReviewsController } from './reviews.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './entities/review.entity';
import { ReviewToken } from './entities/review-token.entity';
import { Trip } from '../trips/entities/trip.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Review, ReviewToken, Trip])],
  controllers: [ReviewsController],
  providers: [ReviewsService],
})
export class ReviewsModule {}
