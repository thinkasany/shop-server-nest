import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';
import { ShowSettingsEntity } from './entities/showSettings.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SettingsEntity, ShowSettingsEntity])],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
