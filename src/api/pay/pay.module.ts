import { Module } from '@nestjs/common';
import { IndexService } from './pay.service';
import { IndexController } from './pay.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';

@Module({
  imports: [TypeOrmModule.forFeature([])],
  controllers: [IndexController],
  providers: [IndexService, GetLoginUserIdInterceptor],
})
export class PayModule {}
