import { Body, Controller, Post, Get, Query } from '@nestjs/common';
import { CommentService } from './comment.service';

@Controller('admin/comment')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Get()
  indexAction(
    @Query('page') page,
    @Query('size') size,
    @Query('nickname') nickname,
  ) {
    return this.commentService.indexAction({ page, size, nickname });
  }
  @Get('saleStatus')
  saleStatusAction(@Query('status') status, @Query('id') id) {
    return this.commentService.saleStatusAction({ status, id });
  }
  @Get('info')
  infoAction(@Query('id') id) {
    return this.commentService.infoAction(id);
  }
  @Post('getallrelate')
  getallrelateAction() {
    return this.commentService.getallrelateAction();
  }
  @Post('store')
  updateSortAction(@Body() payload) {
    return this.commentService.updateSortAction(payload);
  }
  @Post('destory')
  destoryAction(@Body() payload) {
    return this.commentService.destoryAction(payload);
  }
}
