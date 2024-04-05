import { Module } from '@nestjs/common';
import Joi from 'joi';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Tour } from './tour/entities/tour.entity';
import { Region } from './tour/entities/region.entity';
import { TourModule } from './tour/tour.module';
import { ReservationModule } from './reservation/reservation.module';
import { ReviewsModule } from './reviews/reviews.module';
import { Review } from './reviews/entities/review.entity';
import { Reservation } from './reservation/entities/reservation.entity';
import { ReservationSchedulerService } from './scheduler/scheduler.service';
import { ScheduleModule } from '@nestjs/schedule';

const typeOrmModuleOptions = {
  useFactory: async (
    configService: ConfigService,
  ): Promise<TypeOrmModuleOptions> => ({
    type: 'mysql',
    username: configService.get('DB_USERNAME'),
    password: configService.get('DB_PASSWORD'),
    host: configService.get('DB_HOST'),
    port: configService.get('DB_PORT'),
    database: configService.get('DB_NAME'),
    entities: [Tour, Region, Review, Reservation],

    synchronize: configService.get('DB_SYNC'),
    logging: true,
  }),
  inject: [ConfigService],
};

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validationSchema: Joi.object({
        JWT_SECRET_KEY: Joi.string().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_NAME: Joi.string().required(),
        DB_SYNC: Joi.boolean().required(),
      }),
    }),
    TypeOrmModule.forRootAsync(typeOrmModuleOptions),
    ScheduleModule.forRoot(),
    TourModule,
    ReviewsModule,
    ReservationModule,
  ],

  controllers: [AppController],
  providers: [AppService, ReservationSchedulerService],
})
export class AppModule {}
