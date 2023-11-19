import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsController } from './settings.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from './entities/setting.entity';
import { ShowSettingsEntity } from './entities/showSettings.entity';
import { ShopUserEntity } from 'src/admin/user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SettingsEntity,
      ShowSettingsEntity,
      ShopUserEntity,
    ]),
  ],
  controllers: [SettingsController],
  providers: [SettingsService],
})
export class SettingsModule {}
