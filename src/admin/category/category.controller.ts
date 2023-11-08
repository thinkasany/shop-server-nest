import { Controller, Get, Query } from '@nestjs/common';
import { CategoryService } from './category.service';

@Controller('admin/category')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get()
  indexAction() {
    return this.categoryService.indexAction();
  }
  @Get('topCategory')
  topCategoryAction() {
    return this.categoryService.topCategoryAction();
  }
  @Get('info')
  infoAction(@Query('id') id) {
    return this.categoryService.infoAction(id);
  }
  @Get('categoryStatus')
  categoryStatusAction(@Query('id') id, @Query('status') status) {
    return this.categoryService.categoryStatusAction({ status, id });
  }
  @Get('showStatus')
  showStatusAction(@Query('id') id, @Query('status') status) {
    return this.categoryService.showStatusAction({ status, id });
  }
  @Get('channelStatus')
  channelStatusAction(@Query('id') id, @Query('status') status) {
    return this.categoryService.channelStatusAction({ status, id });
  }
}
