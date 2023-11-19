import { Module } from '@nestjs/common';
import { GoodsService } from './goods.service';
import { GoodsController } from './goods.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { CategoryEntity } from 'src/api/catalog/entities/catalog.entity';
import { ProductEntity } from 'src/api/goods/entities/product.entity';
import { GoodsSpecificationEntity } from 'src/api/goods/entities/goodsSpecification.entity';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { SpecificationEntity } from 'src/api/goods/entities/specification.entity';
import { GoodsGalleryEntity } from 'src/api/goods/entities/goodsGallery.entity';
import { ShopFreightTemplateEntity } from './entities/freightTemplate.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // 加载配置
    TypeOrmModule.forFeature([
      GoodsEntity,
      CategoryEntity,
      ProductEntity,
      GoodsSpecificationEntity,
      SpecificationEntity,
      CartEntity,
      GoodsGalleryEntity,
      ShopFreightTemplateEntity,
    ]),
  ],
  controllers: [GoodsController],
  providers: [GoodsService],
})
export class AdminGoodsModule {}
