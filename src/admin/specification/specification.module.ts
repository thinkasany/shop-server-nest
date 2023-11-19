import { Module } from '@nestjs/common';
import { SpecificationService } from './specification.service';
import { SpecificationController } from './specification.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SpecificationEntity } from 'src/api/goods/entities/specification.entity';
import { ProductEntity } from 'src/api/goods/entities/product.entity';
import { GoodsSpecificationEntity } from 'src/api/goods/entities/goodsSpecification.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      SpecificationEntity,
      ProductEntity,
      GoodsSpecificationEntity,
    ]),
  ],
  controllers: [SpecificationController],
  providers: [SpecificationService],
})
export class SpecificationModule {}
