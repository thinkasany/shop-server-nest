import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { LoginGuard } from 'src/login.guard';
import { FootprintService } from './footprint.service';

@Controller('api/footprint')
export class FootprintController {
  constructor(private readonly footprintService: FootprintService) {}

  @Get('list')
  @UseGuards(LoginGuard)
  listAction(
    @Query('page') page: number,
    @Query('size') size: number,
    @Req() request,
  ) {
    const { id: userId } = request.user;
    return this.footprintService.listAction({ page, size, userId });
  }

  @Post('delete')
  @UseGuards(LoginGuard)
  create(@Body() payload, @Req() request) {
    const { id: userId } = request.user;
    return this.footprintService.deleteAction({ ...payload, userId });
  }
}
