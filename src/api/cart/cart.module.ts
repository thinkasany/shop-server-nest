import { Module } from '@nestjs/common';
import { CartService } from './cart.service';
import { CartController } from './cart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from './entities/cart.entity';
import { GoodsEntity } from '../goods/entities/good.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { GoodsSpecificationEntity } from '../goods/entities/goodsSpecification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      CartEntity,
      GoodsEntity,
      ProductEntity,
      GoodsSpecificationEntity,
    ]),
  ],
  controllers: [CartController],
  providers: [CartService],
})
export class CartModule {}
