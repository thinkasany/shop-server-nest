import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from 'src/api/region/entities/region.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { OrderEntity } from '../index/entities/order.entity';
import { OrderExpressEntity } from './entities/orderExpress.entity';
import { OrderGoodsEntity } from 'src/api/goods/entities/orderGoods.entity';
import { ShopUserEntity } from '../user/entities/user.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      RegionEntity,
      SettingsEntity,
      OrderEntity,
      OrderExpressEntity,
      OrderGoodsEntity,
      ShopUserEntity,
    ]),
  ],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AdminOrderModule {}
