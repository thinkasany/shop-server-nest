import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatelogController } from './catalog.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoryEntity } from './entities/catalog.entity';
import { GoodsEntity } from '../goods/entities/good.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoryEntity, GoodsEntity])],
  controllers: [CatelogController],
  providers: [CatalogService],
})
export class CatalogModule {}
