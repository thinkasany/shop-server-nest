import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { KeywordsEntity } from './entities/keywords.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { ShopSearchHistoryEntity } from './entities/shopSearchHistory.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([KeywordsEntity, ShopSearchHistoryEntity]),
  ],
  controllers: [SearchController],
  providers: [SearchService, GetLoginUserIdInterceptor],
})
export class SearchModule {}
