import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
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
    const { user_id: userId } = request.user;
    return this.footprintService.listAction({ page, size, userId });
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.footprintService.findOne(+id);
  // }

  //   @Post()
  //   create(@Body() createFootprintDto: CreateFootprintDto) {
  //     return this.footprintService.create(createFootprintDto);
  //   }
}
