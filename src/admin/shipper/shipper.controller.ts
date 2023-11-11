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
  @Get('freight')
  freightAction() {
    return this.shipperService.freightAction();
  }
  @Post('store')
  storeAction(@Body() payload) {
    return this.shipperService.storeAction(payload);
  }
  @Post('freightdetail')
  freightdetailAction(@Body() payload) {
    return this.shipperService.freightdetailAction(payload);
  }
  @Post('getareadata')
  getareadataAction() {
    return this.shipperService.getareadataAction();
  }
  @Get('exceptarea')
  exceptareaAction() {
    return this.shipperService.exceptareaAction();
  }
  @Post('addExceptArea')
  addExceptAreaAction(@Body() payload) {
    return this.shipperService.addExceptAreaAction(payload);
  }
  @Post('exceptAreaDetail')
  exceptAreaDetailAction(@Body() payload) {
    return this.shipperService.exceptAreaDetailAction(payload);
  }
  @Post('exceptAreaDelete')
  exceptAreaDeleteAction(@Body() payload) {
    return this.shipperService.exceptAreaDeleteAction(payload);
  }
}
