import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { CatalogService } from './catalog.service';

@Controller('api/catalog')
export class CatelogController {
  constructor(private readonly catelogService: CatalogService) {}
  // 获取分类栏目数据
  @Get('index')
  async indexAction() {
    return await this.catelogService.indexAction();
  }

  @Get('current')
  async currentAction(@Query('id') id: number) {
    return await this.catelogService.currentAction(id);
  }

  @Post('currentlist')
  async currentlistAction(
    @Body() payload: { id: number; size: number; page: number },
  ) {
    return await this.catelogService.currentlistAction(payload);
  }
}
