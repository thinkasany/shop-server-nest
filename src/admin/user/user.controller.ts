import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('admin/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  indexAction(
    @Query('page') page,
    @Query('size') size,
    @Query('nickname') nickname,
  ) {
    return this.userService.indexAction({ page, size, nickname });
  }
}
