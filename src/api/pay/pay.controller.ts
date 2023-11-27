import { Controller, Get, Query, UseInterceptors } from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { IndexService } from './pay.service';

@Controller('api/pay')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get('preWeixinPay')
  //   @UseInterceptors(GetLoginUserIdInterceptor)
  preWeixinPayAction(@Query('orderId') orderId: number) {
    // const { user_id: userId } = request.user || {};
    return this.indexService.preWeixinPayAction(orderId);
  }
}
