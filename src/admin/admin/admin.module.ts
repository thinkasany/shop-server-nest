import { Module } from '@nestjs/common';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ShopShowSettingsEntity } from './entities/shopShowSettings.entity';
import { ShopAdminEntity } from './entities/admin.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ShopShowSettingsEntity, ShopAdminEntity]),
  ],
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}
