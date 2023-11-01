import { PartialType } from '@nestjs/mapped-types';
import { CreateSearchDto } from './create-search.dto';

export class UpdateSearchDto extends PartialType(CreateSearchDto) {}
