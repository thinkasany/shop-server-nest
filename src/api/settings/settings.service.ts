import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SettingsEntity } from './entities/setting.entity';

@Injectable()
export class SettingsService {
  constructor(
    @InjectRepository(SettingsEntity)
    private settingsRepository: Repository<SettingsEntity>,
  ) {}
  async showSettingsAction(): Promise<SettingsEntity> {
    return await this.settingsRepository.findOne({ where: { id: 1 } });
  }
}
