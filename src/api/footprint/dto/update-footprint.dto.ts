import { PartialType } from '@nestjs/mapped-types';
import { CreateFootprintDto } from './create-footprint.dto';

export class UpdateFootprintDto extends PartialType(CreateFootprintDto) {}
