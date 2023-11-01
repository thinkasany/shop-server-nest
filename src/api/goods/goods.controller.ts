import { Controller, Get, Query, Req, UseInterceptors } from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { GoodsService } from './goods.service';

@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  findAll() {
    return this.goodsService.indexAction();
  }

  @Get('count')
  countAction() {
    return this.goodsService.countAction();
  }

  @Get('detail')
  @UseInterceptors(GetLoginUserIdInterceptor)
  detailAction(@Query('id') id: number, @Req() request) {
    const { id: userId } = request.user || {};
    return this.goodsService.detailAction(id, userId);
  }
}
