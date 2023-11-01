import { Controller, Get, Req, UseInterceptors } from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { IndexService } from './index.service';

@Controller('api/index')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get('appInfo')
  @UseInterceptors(GetLoginUserIdInterceptor)
  appInfoAction(@Req() request) {
    const { user_id: userId } = request.user || {};
    return this.indexService.appInfoAction(userId);
  }
}
