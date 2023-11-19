import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { UserEntity } from 'src/api/auth/entities/auth.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { OrderEntity } from './entities/order.entity';
import { ShopUserEntity } from '../user/entities/user.entity';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(), // 加载配置
    TypeOrmModule.forFeature([
      GoodsEntity,
      UserEntity,
      SettingsEntity,
      OrderEntity,
      ShopUserEntity,
      CartEntity,
    ]),
  ],
  controllers: [IndexController],
  providers: [IndexService],
})
export class AdminIndexModule {}
