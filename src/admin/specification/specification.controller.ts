import { Controller, Get, Post, Body } from '@nestjs/common';
import { SpecificationService } from './specification.service';

@Controller('admin/specification')
export class SpecificationController {
  constructor(private readonly specificationService: SpecificationService) {}

  @Post('getGoodsSpec')
  getGoodsSpecAction(@Body() payload) {
    return this.specificationService.getGoodsSpecAction(payload);
  }
}
