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
    ]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class GoodsModule {}
