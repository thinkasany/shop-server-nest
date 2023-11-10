import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';
import { ShipperEntity } from './entities/shipper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShipperEntity, SettingsEntity])],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
