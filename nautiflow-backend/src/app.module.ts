import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BoatOperatorsModule } from './modules/boat-operators/boat-operators.module';
import { TripsModule } from './modules/trips/trips.module';
import { getDatabaseConfig } from './config/database.config';
import { EmptyLegsModule } from './modules/empty-legs/empty-legs.module';
import { ReviewsModule } from './modules/reviews/reviews.module';
import { AdminModule } from './modules/admin/admin.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getDatabaseConfig,
    }),
    BoatOperatorsModule,
    TripsModule,
    EmptyLegsModule,
    ReviewsModule,
    AdminModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
