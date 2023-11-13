import { Controller, Get, Post, Body } from '@nestjs/common';
import { NoticeService } from './notice.service';

@Controller('admin/notice')
export class NoticeController {
  constructor(private readonly noticeService: NoticeService) {}

  @Get()
  indexAction() {
    return this.noticeService.indexAction();
  }
  @Post('update')
  updateAction(@Body() payload) {
    return this.noticeService.updateAction(payload);
  }
  @Post('add')
  addAction(@Body() payload) {
    return this.noticeService.addAction(payload);
  }
  @Post('destory')
  destoryAction(@Body() payload) {
    return this.noticeService.destoryAction(payload);
  }
}
