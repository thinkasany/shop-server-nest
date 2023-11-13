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

@Module({
  imports: [
    TypeOrmModule.forFeature([
      OrderEntity,
      OrderGoodsEntity,
      RegionEntity,
      SettingsEntity,
      OrderEntity,
      OrderExpressEntity,
      OrderGoodsEntity,
      ShopUserEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService, AdminOrderService],
})
export class OrderModule {}
