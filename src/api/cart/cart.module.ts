import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { GoodsEntity } from '../goods/entities/good.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { GoodsSpecificationEntity } from '../goods/entities/goodsSpecification.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { AddressService } from '../address/address.service';
import { RegionEntity } from '../region/entities/region.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      GoodsEntity,
      ProductEntity,
      GoodsSpecificationEntity,
      OrderGoodsEntity,
      AddressEntity,
      RegionEntity,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService, AddressService],
})
export class CartModule {}
