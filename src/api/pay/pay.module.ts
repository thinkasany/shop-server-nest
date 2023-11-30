import { Module } from '@nestjs/common';
import { IndexService } from './pay.service';
import { IndexController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { OrderEntity } from '../order/entities/order.entity';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([OrderEntity, OrderGoodsEntity, ProductEntity]),
  ],
  controllers: [IndexController],
  providers: [IndexService, GetLoginUserIdInterceptor],
})
export class PayModule {}
