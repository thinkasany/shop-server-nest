import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
