import {
  Controller,
  Get,
  Req,
  Query,
  UseInterceptors,
  Post,
} from '@nestjs/common';
import { GetLoginUserIdInterceptor } from 'src/getLoginUserId.interceptor';
import { SearchService } from './search.service';

@Controller('api/search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Get('index')
  @UseInterceptors(GetLoginUserIdInterceptor)
  indexAction(@Req() request) {
    const { id: userId } = request.user || {};
    return this.searchService.indexAction(userId);
  }

  @Get('helper')
  helperAction(@Query('keyword') keyword: string) {
    return this.searchService.helperAction(keyword);
  }
  @Post('clearHistory')
  @UseInterceptors(GetLoginUserIdInterceptor)
  clearHistoryAction(@Req() request) {
    const { id: userId } = request.user || {};
    return this.searchService.clearHistoryAction(userId);
  }
}
