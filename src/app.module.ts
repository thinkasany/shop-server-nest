import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GoodsModule } from './api/goods/goods.module';
import { SettingsModule } from './api/settings/settings.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GoodsEntity } from './api/goods/entities/good.entity';
import { SettingsEntity } from './api/settings/entities/setting.entity';
import { AuthModule } from './api/auth/auth.module';
import { UserEntity } from './api/auth/entities/auth.entity';
import { AddressModule } from './api/address/address.module';
import { AddressEntity } from './api/address/entities/address.entity';
import { RegionEntity } from './api/address/entities/region.entity';

@Module({
  imports: [
    GoodsModule,
    SettingsModule,
    AuthModule,
    AddressModule,
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456',
      database: 'shop', //shop
      synchronize: true,
      logging: true,
      entities: [
        GoodsEntity,
        SettingsEntity,
        UserEntity,
        AddressEntity,
        RegionEntity,
      ],
      poolSize: 10,
      connectorPackage: 'mysql2',
      extra: {
        authPlugin: 'sha256_password',
      },
    }),
    AuthModule,
    AddressModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
