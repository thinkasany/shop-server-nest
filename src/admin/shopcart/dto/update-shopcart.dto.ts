import { PartialType } from '@nestjs/mapped-types';
import { CreateShopcartDto } from './create-shopcart.dto';

export class UpdateShopcartDto extends PartialType(CreateShopcartDto) {}
