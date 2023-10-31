import { Controller, Get, Post, Body } from '@nestjs/common';
import { AddressService } from './address.service';

@Controller('/api/address')
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Get('getAddresses')
  getAddressesAction() {
    return this.addressService.getAddressesAction();
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
