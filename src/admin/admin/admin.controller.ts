import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin/admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Get()
  indexAction() {
    return this.adminService.indexAction();
  }
  @Get('showset')
  showsetAction() {
    return this.adminService.showsetAction();
  }

  @Post('showsetStore')
  showsetStoreAction(@Body() paylaod) {
    return this.adminService.showsetStoreAction(paylaod);
  }
}
