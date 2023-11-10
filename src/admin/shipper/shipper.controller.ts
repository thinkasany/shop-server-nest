import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { ShipperService } from './shipper.service';

@Controller('admin/shipper')
export class ShipperController {
  constructor(private readonly shipperService: ShipperService) {}

  @Get()
  indexAction() {
    return this.shipperService.indexAction();
  }
  @Get('list')
  findlistActionAll(
    @Query('page') page,
    @Query('size') size,
    @Query('name') name,
  ) {
    return this.shipperService.listAction({ page, size, name });
  }
  @Post('destory')
  destoryAction(@Body() payload) {
    return this.shipperService.destoryAction(payload);
  }
  @Get('info')
  infoAction(@Query('id') id) {
    return this.shipperService.infoAction({ id });
  }
  @Post('store')
  storeAction(@Body() payload) {
    return this.shipperService.storeAction(payload);
  }
}
