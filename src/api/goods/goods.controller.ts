import { Controller, Get } from '@nestjs/common';
import { GoodsService } from './goods.service';

@Controller('api/goods')
export class GoodsController {
  constructor(private readonly goodsService: GoodsService) {}

  @Get()
  findAll() {
    return this.goodsService.indexAction();
  }

  @Get('test')
  test() {
    console.log('test');
  }
}
