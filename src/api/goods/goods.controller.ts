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

  // @Post()
  // create(@Body() createGoodDto: CreateGoodDto) {
  //   return this.goodsService.create(createGoodDto);
  // }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.goodsService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateGoodDto: UpdateGoodDto) {
  //   return this.goodsService.update(+id, updateGoodDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.goodsService.remove(+id);
  // }
}
