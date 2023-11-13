import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { ShopAdminEntity } from './entities/auth.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TypeOrmModule.forFeature([ShopAdminEntity]),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AdminAuthModule {}
