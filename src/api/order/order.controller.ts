import { Controller, Get, Query, UseGuards, Req } from '@nestjs/common';
import { LoginGuard } from 'src/login.guard';
import { OrderService } from './order.service';

@Controller('api/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // 获取订单列表
  @Get('list')
  @UseGuards(LoginGuard)
  listAction(
    @Query('page') page: number,
    @Query('size') size: number,
    @Query('showType') showType: number,
    @Req() request,
  ) {
    const { id: userId } = request.user;
    return this.orderService.listAction({ userId, page, size, showType });
  }
  @Get('orderCount')
  @UseGuards(LoginGuard)
  orderCountAction(@Req() request) {
    const { id: userId } = request.user;
    return this.orderService.orderCountAction({ userId });
  }
  @Get('detail')
  @UseGuards(LoginGuard)
  detailAction(@Query('orderId') orderId, @Req() request) {
    const { id: userId } = request.user;
    return this.orderService.detailAction({ userId, orderId });
  }
  // 查询物流信息asd
  @Get('express')
  @UseGuards(LoginGuard)
  expressAction(@Query('orderId') orderId, @Req() request) {
    const { id: userId } = request.user;
    return this.orderService.expressAction({ userId, orderId });
  }
  // order 和 order-check 的goodslist
  @Get('orderGoods')
  @UseGuards(LoginGuard)
  orderGoodsAction(@Query('orderId') orderId, @Req() request) {
    const { id: userId } = request.user;
    return this.orderService.orderGoodsAction({ userId, orderId });
  }
}
