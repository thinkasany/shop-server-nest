import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('api/catalog')
export class CatelogController {
  constructor(private readonly catelogService: CatalogService) {}
  // 获取分类栏目数据
  @Get('index')
  indexAction() {
    return this.catelogService.indexAction();
  }

  @Get('current')
  currentAction(@Query('id') id: number) {
    return this.catelogService.currentAction(id);
  }

  @Post('currentlist')
  currentlistAction(
    @Body() payload: { id: number; size: number; page: number },
  ) {
    return this.catelogService.currentlistAction(payload);
  }
}
