import { Controller, Get, Query } from '@nestjs/common';
import { RegionService } from './region.service';

@Controller('/api/region')
export class RegionController {
  constructor(private readonly regionService: RegionService) {}

  @Get('list')
  async listAction(@Query('parentId') parentId: number) {
    return await this.regionService.listAction(parentId);
  }
}
