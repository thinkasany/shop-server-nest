import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import { RegionEntity } from '../region/entities/region.entity';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(AddressEntity)
    private readonly addressRepository: Repository<AddressEntity>,
    @InjectRepository(RegionEntity)
    private readonly regionRepository: Repository<RegionEntity>,
  ) {}
  async getAddressesAction(userId: number) {
    const addressList = await this.addressRepository.find({
      where: { user_id: userId, is_delete: 0 },
      order: { id: 'DESC' },
    });
    console.log(addressList);

    const addressesWithRegionInfo = await Promise.all(
      addressList.map(async (addressItem) => {
        const { province_id, city_id, district_id } = addressItem;
        const province = await this.getRegionName(province_id);
        const city = await this.getRegionName(city_id);
        const district = await this.getRegionName(district_id);

        const fullRegion = `${province} ${city} ${district}`;

        return { ...addressItem, province, city, district, fullRegion };
      }),
    );
    return addressesWithRegionInfo;
  }
  async getRegionName(regionId: number): Promise<string> {
    // Replace with your Region entity and repository
    const region = await this.regionRepository.findOne({
      where: { id: regionId },
    });
    return region ? region.name : '';
  }

  async addressDetailAction(id: number, userId: number) {
    // const userId = await this.idParserService.parseId();
    console.log(id, userId);
  }

  async deleteAddressAction(payload: { id: number }) {
    const res = await this.addressRepository.findOne({
      where: { id: payload.id },
    });
    if (!res) {
      return;
    }
    res.is_delete = 1;
    await this.addressRepository.save(res);
  }
}
