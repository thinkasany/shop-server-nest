import { Controller, Get, Post, Body, Query } from '@nestjs/common';
import { AdService } from './ad.service';

@Controller('admin/ad')
export class AdController {
  constructor(private readonly adService: AdService) {}

  @Get()
  indexAction(@Query('page') page, @Query('size') size) {
    return this.adService.indexAction({ page, size });
  }
  @Get('saleStatus')
  saleStatusAction(@Query('status') status, @Query('id') id) {
    return this.adService.saleStatusAction({ status, id });
  }
}
