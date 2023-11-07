import { PartialType } from '@nestjs/mapped-types';
import { CreateAdDto } from './create-ad.dto';

export class UpdateAdDto extends PartialType(CreateAdDto) {}
