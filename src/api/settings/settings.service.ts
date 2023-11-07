import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShowSettingsEntity } from './entities/showSettings.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(ShowSettingsEntity)
    private showSettingsRepository: Repository<ShowSettingsEntity>,
  ) {}
  async showSettingsAction() {
    const data = await this.showSettingsRepository.findOne({
      where: { id: 1 },
    });
    return data;
  }
}
