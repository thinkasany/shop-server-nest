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

@Controller('/api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) { }

  @Get('getAddresses')
  @UseGuards(LoginGuard)
  getAddressesAction(@Req() request) {
    const { user_id: userId } = request.user;
    return this.addressService.getAddressesAction(userId);
  }

  @Get('addressDetail')
  @UseGuards(LoginGuard)
  async listAction(@Query('id') id: number, @Req() request) {
    const { user_id: userId } = request.user;
    return await this.addressService.addressDetailAction(id, userId);
  }

  @Post('deleteAddress')
  create(@Body() payload: { id: number }) {
    return this.addressService.deleteAddressAction(payload);
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.addressService.findOne(+id);
  // }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateAddressDto: UpdateAddressDto) {
  //   return this.addressService.update(+id, updateAddressDto);
  // }
}
