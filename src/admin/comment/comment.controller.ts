import { Controller, Get, Query } from '@nestjs/common';
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
}
