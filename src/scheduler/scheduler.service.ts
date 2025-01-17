import { Injectable } from '@nestjs/common';
import { Cron, Interval } from '@nestjs/schedule';
import { ReservationService } from 'src/reservation/reservation.service';

@Injectable()
export class ReservationSchedulerService {
  //   private readonly logger = new Logger(ReservationSchedulerService.name);

  constructor(private readonly reservationService: ReservationService) {}

  // @Cron('0 0 * * *')
  // async handleCron() {
  //   console.log('Running scheduled task at midnight');
  @Interval(10000)
  async handleInterval() {
    console.log('Running scheduled task every 10 seconds');

    // 현재 시간 이후에 완료된 예약을 처리하는 메서드 호출
    await this.reservationService.processCompletedReservations();
  }
}
