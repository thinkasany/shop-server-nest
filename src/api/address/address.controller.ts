import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { LoginGuard } from 'src/login.guard';
import { AddressService } from './address.service';
import { UpdateAddressDto } from './dto/update-address.dto';

@Controller('/api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('getAddresses')
  @UseGuards(LoginGuard)
  getAddressesAction(@Req() request) {
    const { id: userId } = request.user;
    return this.addressService.getAddressesAction(userId);
  }

  @Get('addressDetail')
  @UseGuards(LoginGuard)
  async listAction(@Query('id') id: number, @Req() request) {
    const { id: user_id } = request.user;
    return await this.addressService.addressDetailAction(id, user_id);
  }

  @Post('deleteAddress')
  deleteAddressAction(@Body() payload: { id: number }) {
    return this.addressService.deleteAddressAction(payload);
  }

  @Post('saveAddress')
  @UseGuards(LoginGuard)
  saveAddressAction(@Body() payload: UpdateAddressDto, @Req() request) {
    const { id: userId } = request.user;
    return this.addressService.saveAddressAction(payload, userId);
  }
}
