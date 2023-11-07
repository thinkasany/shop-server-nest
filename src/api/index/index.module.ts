import { Module } from '@nestjs/common';
import { IndexService } from './index.service';
import { IndexController } from './index.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AdEntity } from './entities/ad.entity';
import { NoticeEntity } from './entities/notice.entity';
import { CategoryEntity } from '../catalog/entities/catalog.entity';
import { GoodsEntity } from '../goods/entities/good.entity';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { CartEntity } from '../cart/entities/cart.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AdEntity,
      NoticeEntity,
      CategoryEntity,
      GoodsEntity,
      CartEntity,
    ]),
  ],
  controllers: [IndexController],
  providers: [IndexService, GetLoginUserIdInterceptor],
})
export class IndexModule {}
