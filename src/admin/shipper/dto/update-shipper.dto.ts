import { PartialType } from '@nestjs/mapped-types';
import { CreateShipperDto } from './create-shipper.dto';

export class UpdateShipperDto extends PartialType(CreateShipperDto) {}
