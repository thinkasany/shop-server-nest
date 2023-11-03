import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { GoodsEntity } from './entities/good.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsGalleryEntity } from './entities/goodsGallery.entity';
import { ProductEntity } from './entities/product.entity';
import { GoodsSpecificationEntity } from './entities/goodsSpecification.entity';
import { SpecificationEntity } from './entities/specification.entity';
import { ShopCommentEntity } from './entities/comment.entity';
import { OrderGoodsEntity } from './entities/orderGoods.entity';
import { FootprintService } from '../footprint/footprint.service';
import { FootprintEntity } from '../footprint/entities/footprint.entity';
import { ShopSearchHistoryEntity } from '../search/entities/shopSearchHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GoodsEntity,
      GoodsGalleryEntity,
      ProductEntity,
      GoodsSpecificationEntity,
      SpecificationEntity,
      ShopCommentEntity,
      OrderGoodsEntity,
      FootprintEntity,
      ShopSearchHistoryEntity,
    ]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService, FootprintService],
})
export class GoodsModule {}
