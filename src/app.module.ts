import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodsModule } from './api/goods/goods.module';
import { SettingsModule } from './api/settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './api/auth/auth.module';
import { AddressModule } from './api/address/address.module';
import { RegionModule } from './api/region/region.module';
import { JwtModule } from '@nestjs/jwt';
import { FootprintModule } from './api/footprint/footprint.module';
import { OrderModule } from './api/order/order.module';
import { CatalogModule } from './api/catalog/catalog.module';
import { IndexModule } from './api/index/index.module';
import { CartModule } from './api/cart/cart.module';
import { SearchModule } from './api/search/search.module';
import { AdminAuthModule } from './admin/auth/auth.module';
import { UserModule } from './admin/user/user.module';
import { AdminModule } from './admin/admin/admin.module';
import { NoticeModule } from './admin/notice/notice.module';
import { AdModule } from './admin/ad/ad.module';
import { ShopcartModule } from './admin/shopcart/shopcart.module';
import { CommentModule } from './admin/comment/comment.module';
import { CategoryModule } from './admin/category/category.module';
import { AdminGoodsModule } from './admin/goods/goods.module';
import { AdminIndexModule } from './admin/index/index.module';
import { AdminOrderModule } from './admin/order/order.module';
import { ShipperModule } from './admin/shipper/shipper.module';
import { SpecificationModule } from './admin/specification/specification.module';
import * as path from 'path';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'sdfsdfsdf123123!ASDasdasdasdasda',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'shop', //shop
      synchronize: true,
      logging: true,
      // autoLoadEntities: true,
      entities: [path.join(__dirname, '**', '*.entity.{ts,js}')],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    AdminGoodsModule,
    AdminIndexModule,
    AdminOrderModule,
    GoodsModule,
    SettingsModule,
    AuthModule,
    AddressModule,
    RegionModule,
    FootprintModule,
    OrderModule,
    CatalogModule,
    IndexModule,
    CartModule,
    SearchModule,
    AdminAuthModule,
    UserModule,
    AdminModule,
    NoticeModule,
    AdModule,
    ShopcartModule,
    CommentModule,
    CategoryModule,
    ShipperModule,
    SpecificationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
