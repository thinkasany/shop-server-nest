import { Module } from '@nestjs/common';
import { SearchService } from './search.service';
import { SearchController } from './search.controller';
import { KeywordsEntity } from './entities/keywords.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([KeywordsEntity])],
  controllers: [SearchController],
  providers: [SearchService, GetLoginUserIdInterceptor],
})
export class SearchModule {}
