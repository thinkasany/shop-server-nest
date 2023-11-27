import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { OrderEntity } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { AdminOrderService } from 'src/admin/order/order.service';
import { RegionEntity } from '../region/entities/region.entity';
import { SettingsEntity } from '../settings/entities/setting.entity';
import { OrderExpressEntity } from 'src/admin/order/entities/orderExpress.entity';
import { ShopUserEntity } from 'src/admin/user/entities/user.entity';
import { CartEntity } from '../cart/entities/cart.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { GoodsEntity } from '../goods/entities/good.entity';
import { GoodsSpecificationEntity } from '../goods/entities/goodsSpecification.entity';
import { CartService } from '../cart/cart.service';
import { AddressService } from '../address/address.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderGoodsEntity,
      RegionEntity,
      SettingsEntity,
      OrderEntity,
      OrderExpressEntity,
      GoodsEntity,
      ProductEntity,
      GoodsSpecificationEntity,
      ShopUserEntity,
      CartEntity,
      AddressEntity,
      SettingsEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, AdminOrderService, CartService, AddressService],
})
export class OrderModule {}
