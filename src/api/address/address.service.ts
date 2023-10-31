import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AddressEntity } from './entities/address.entity';
import { RegionEntity } from '../region/entities/region.entity';
import { UpdateAddressDto } from './dto/update-address.dto';

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

  async addressDetailAction(id: number) {
    const addressInfo: any = await this.addressRepository.findOne({
      where: { id },
    });
    if (addressInfo) {
      addressInfo.province_name = await this.getRegionName(
        addressInfo.province_id,
      );
      addressInfo.city_name = await this.getRegionName(addressInfo.city_id);
      addressInfo.district_name = await this.getRegionName(
        addressInfo.district_id,
      );
      addressInfo.full_region =
        addressInfo.province_name +
        addressInfo.city_name +
        addressInfo.district_name;
    }
    return addressInfo;
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

  async saveAddressAction(payload: UpdateAddressDto, userId: number) {
    const { id, is_default } = payload;
    const addressData = {
      ...payload,
      user_id: userId,
    };

    if (!id) {
      const newAddress = this.addressRepository.create(addressData);
      await this.addressRepository.save(newAddress);
    } else {
      await this.addressRepository.update({ id, user_id: userId }, addressData);
    }

    // 如果设置为默认，则取消其它的默认
    if (is_default === 1) {
      await this.addressRepository.update(
        { id, user_id: userId },
        { is_default: 0 },
      );
    }

    const res = this.addressRepository.findOne({ where: { id } });
    return res;
  }
}
