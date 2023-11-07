import { Controller, Get, Query } from '@nestjs/common';
import { ShopcartService } from './shopcart.service';

@Controller('admin/shopcart')
export class ShopcartController {
  constructor(private readonly shopcartService: ShopcartService) {}

  @Get()
  indexAction(@Query('page') page, @Query('size') size, @Query('name') name) {
    return this.shopcartService.indexAction({ page, size, name });
  }
}
