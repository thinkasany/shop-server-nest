import { Module } from '@nestjs/common';
import { ShipperService } from './shipper.service';
import { ShipperController } from './shipper.controller';
import { ShipperEntity } from './entities/shipper.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { ShopFreightTemplateEntity } from '../goods/entities/freightTemplate.entity';
import { FreightTemplateGroupEntity } from './entities/freightTemplateGroup.entity';
import { RegionEntity } from 'src/api/region/entities/region.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      ShipperEntity,
      SettingsEntity,
      ShopFreightTemplateEntity,
      FreightTemplateGroupEntity,
      RegionEntity,
    ]),
  ],
  controllers: [ShipperController],
  providers: [ShipperService],
})
export class ShipperModule {}
