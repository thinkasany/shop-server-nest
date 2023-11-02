import { Controller, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { GoodsService } from './goods.service';

@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  indexAction() {
    return this.goodsService.indexAction();
  }

  @Get('count')
  countAction() {
    return this.goodsService.countAction();
  }

  @Get('comment')
  commentAction(@Query('id') id: number) {
    return this.goodsService.commentAction(id);
  }

  @Get('detail')
  @UseInterceptors(GetLoginUserIdInterceptor)
  detailAction(@Query('id') id: number, @Req() request) {
    const { id: userId } = request.user || {};
    return this.goodsService.detailAction(id, userId);
  }
}
