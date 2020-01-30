import { Injectable } from '@nestjs/common';

@Injectable()
export class StatsService {
  private stats = {};
  private readonly defaultStats = {
    created: 0,
    updated: 0,
    deleted: 0,
  };

  public get(userId: string) {
    return this.stats[userId] || this.defaultStats;
  }

  public increaseCreate(userId: string) {
    const current = this.get(userId);
    this.stats[userId] = { ...current, created: current.created + 1 };
  }

  public increaseUpdate(userId: string) {
    const current = this.get(userId);
    this.stats[userId] = { ...current, updated: current.updated + 1 };
  }

  public increaseDelete(userId: string) {
    const current = this.get(userId);
    this.stats[userId] = { ...current, deleted: current.deleted + 1 };
  }
}
