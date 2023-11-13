import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('admin/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
