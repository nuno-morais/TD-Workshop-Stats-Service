import { Controller, Get, Query } from '@nestjs/common';
import { StatsService } from './stats.service';

@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) { }

  @Get()
  get(@Query('user_id') userId: string) {
    return this.statsService.get(userId);
  }
}
