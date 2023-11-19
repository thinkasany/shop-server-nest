import { Controller, Get, Query, Post, Body } from '@nestjs/common';
import { IndexService } from './index.service';

@Controller('admin/index')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get()
  indexAction() {
    return this.indexService.indexAction();
  }
  @Get('main')
  mainAction(@Query('pindex') pindex) {
    return this.indexService.mainAction({ pindex });
  }
  @Post('getQiniuToken')
  getQiniuTokenAction() {
    return this.indexService.getQiniuTokenAction();
  }
}
