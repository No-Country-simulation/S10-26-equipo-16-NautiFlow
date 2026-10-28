import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BoatOperator } from '../boat-operators/entities/boat-operator.entity';

@Module({
  imports: [TypeOrmModule.forFeature([BoatOperator])],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}