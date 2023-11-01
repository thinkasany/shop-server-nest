import { Controller, Get } from '@nestjs/common';
import { IndexService } from './index.service';

@Controller('api/index')
export class IndexController {
  constructor(private readonly indexService: IndexService) {}

  @Get('appInfo')
  appInfoAction() {
    return this.indexService.appInfoAction();
  }
}
