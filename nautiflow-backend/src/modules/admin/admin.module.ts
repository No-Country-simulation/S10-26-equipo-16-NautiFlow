import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { BoatOperator } from '../boat-operators/entities/boat-operator.entity';
import { AdminRoleGuard } from '../auth/guards/admin-role.guard';

@Module({
  imports: [TypeOrmModule.forFeature([BoatOperator])],
  controllers: [AdminController],
  providers: [AdminService, AdminRoleGuard],
})
export class AdminModule {}
