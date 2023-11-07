import { Module } from '@nestjs/common';
import { FootprintService } from './footprint.service';
import { FootprintController } from './footprint.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FootprintEntity } from './entities/footprint.entity';
import { GoodsEntity } from '../goods/entities/good.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FootprintEntity, GoodsEntity])],
  controllers: [FootprintController],
  providers: [FootprintService],
})
export class FootprintModule {}
