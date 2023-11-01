import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdEntity } from './entities/ad.entity';
import { NoticeEntity } from './entities/notice.entity';
import { CategoryEntity } from '../catalog/entities/catalog.entity';
import { GoodsEntity } from '../goods/entities/good.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdEntity,
      NoticeEntity,
      CategoryEntity,
      GoodsEntity,
    ]),
  ],
  controllers: [IndexController],
  providers: [IndexService],
})
export class IndexModule {}
