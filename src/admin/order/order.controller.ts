import { Controller, Get, Query } from '@nestjs/common';
import { AdminOrderService } from './order.service';

@Controller('admin/order')
export class OrderController {
  constructor(private readonly orderService: AdminOrderService) {}

  @Get('getAllRegion')
  getAllRegionAction() {
    return this.orderService.getAllRegionAction();
  }
  @Get('getAutoStatus')
  getAutoStatusAction() {
    return this.orderService.getAutoStatusAction();
  }
  @Get()
  indexAction(
    @Query('status') status,
    @Query('page') page,
    @Query('logistic_code') logistic_code,
    @Query('size') size,
    @Query('consignee') consignee,
    @Query('orderSn') orderSn,
  ) {
    return this.orderService.indexAction({
      status,
      logistic_code,
      page,
      size,
      consignee,
      orderSn,
    });
  }
}
