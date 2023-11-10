import { Module } from '@nestjs/common';
import { OrderService } from './order.service';
import { OrderController } from './order.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RegionEntity } from 'src/api/region/entities/region.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RegionEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class AdminOrderModule {}
