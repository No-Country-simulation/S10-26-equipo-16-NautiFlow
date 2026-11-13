import { NotFoundException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { Trip } from '../trips/entities/trip.entity';
import { Review } from './entities/review.entity';
import { ReviewToken } from './entities/review-token.entity';
import { ReviewsService } from './reviews.service';

describe('ReviewsService', () => {
  let service: ReviewsService;
  const tokenRepository = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    tokenRepository.findOne.mockReset();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewsService,
        { provide: getRepositoryToken(Review), useValue: {} },
        { provide: getRepositoryToken(ReviewToken), useValue: tokenRepository },
        { provide: getRepositoryToken(Trip), useValue: {} },
        { provide: DataSource, useValue: {} },
      ],
    }).compile();
    service = module.get(ReviewsService);
  });

  it('reports whether the token was already used', async () => {
    tokenRepository.findOne.mockResolvedValueOnce({
      token: 'available-token',
      usedAt: null,
    });
    await expect(service.getTokenStatus('available-token')).resolves.toEqual({
      used: false,
    });

    tokenRepository.findOne.mockResolvedValueOnce({
      token: 'used-token',
      usedAt: new Date(),
    });
    await expect(service.getTokenStatus('used-token')).resolves.toEqual({
      used: true,
    });
  });

  it('rejects unknown tokens', async () => {
    tokenRepository.findOne.mockResolvedValueOnce(null);
    await expect(service.getTokenStatus('missing-token')).rejects.toThrow(
      NotFoundException,
    );
  });
});
