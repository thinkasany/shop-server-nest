import { Module } from '@nestjs/common';
import { ShopcartService } from './shopcart.service';
import { ShopcartController } from './shopcart.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { ShopUserEntity } from '../user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CartEntity, ShopUserEntity])],
  controllers: [ShopcartController],
  providers: [ShopcartService],
})
export class ShopcartModule {}
