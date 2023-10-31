import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('/api/region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('list')
  async listAction(@Query('parentId') parentId: number) {
    return await this.regionService.listAction(parentId);
  }

  // @Post()
  // create(@Body() createRegionDto: CreateRegionDto) {
  //   return this.regionService.create(createRegionDto);
  // }
  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.regionService.findOne(+id);
  // }
}
