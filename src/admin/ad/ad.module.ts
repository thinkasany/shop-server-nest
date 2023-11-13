import { Module } from '@nestjs/common';
import { AdService } from './ad.service';
import { AdController } from './ad.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopAdEntity } from './entities/ad.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ShopAdEntity])],
  controllers: [AdController],
  providers: [AdService],
})
export class AdModule {}
