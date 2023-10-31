import { PartialType } from '@nestjs/mapped-types';
import { CreateRegionDto } from './create-region.dto';

export class UpdateRegionDto extends PartialType(CreateRegionDto) {}
