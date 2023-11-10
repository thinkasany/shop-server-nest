import { Controller, Get, Post, Body } from '@nestjs/common';
import { OrderService } from './order.service';

@Controller('admin/order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Get('getAllRegion')
  getAllRegionAction() {
    return this.orderService.getAllRegionAction();
  }
}
