import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { GoodsService } from './goods.service';

@Controller('admin/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  indexAction(@Query('page') page, @Query('size') size, @Query('name') name) {
    return this.goodsService.indexAction({ page, size, name });
  }
  @Post('updateSort')
  updateSortAction(@Body() payload) {
    return this.goodsService.updateSortAction(payload);
  }
  @Get('indexShowStatus')
  indexShowStatusAction(@Query('status') status, @Query('id') id) {
    return this.goodsService.indexShowStatusAction({ status, id });
  }
  @Get('saleStatus')
  saleStatusAction(@Query('status') status, @Query('id') id) {
    return this.goodsService.saleStatusAction({ status, id });
  }
  @Get('info')
  infoAction(@Query('id') id) {
    return this.goodsService.infoAction({ id });
  }
  @Get('getAllSpecification')
  getAllSpecificationAction() {
    return this.goodsService.getAllSpecificationAction();
  }
  @Get('getAllCategory')
  getAllCategoryAction() {
    return this.goodsService.getAllCategoryAction();
  }
  @Post('getGalleryList')
  getGalleryListAction(@Body() payload) {
    return this.goodsService.getGalleryListAction(payload);
  }
  @Get('getExpressData')
  getExpressDataAction() {
    return this.goodsService.getExpressDataAction();
  }
  @Get('onsale')
  onsaleAction(@Query('page') page, @Query('size') size) {
    return this.goodsService.onsaleAction({ page, size });
  }
  @Get('out')
  outAction(@Query('page') page, @Query('size') size) {
    return this.goodsService.outAction({ page, size });
  }
  @Get('drop')
  dropAction(@Query('page') page, @Query('size') size) {
    return this.goodsService.dropAction({ page, size });
  }
  @Post('uploadHttpsImage')
  uploadHttpsImageAction(@Body() payload) {
    return this.goodsService.uploadHttpsImageAction(payload);
  }
}
