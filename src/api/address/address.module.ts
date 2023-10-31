import { Module } from '@nestjs/common';
import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AddressEntity } from './entities/address.entity';
import { RegionEntity } from '../region/entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([AddressEntity, RegionEntity])],
  controllers: [AddressController],
  providers: [AddressService],
})
export class AddressModule {}
