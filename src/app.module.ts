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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
