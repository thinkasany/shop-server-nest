import { PartialType } from '@nestjs/mapped-types';
import { CreateIndexDto } from './create-index.dto';

export class UpdateIndexDto extends PartialType(CreateIndexDto) {}
