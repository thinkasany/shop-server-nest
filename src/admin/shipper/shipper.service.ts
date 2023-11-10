import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { Repository, Like } from 'typeorm';
import { ShipperEntity } from './entities/shipper.entity';

@Injectable()
export class ShipperService {
  @InjectRepository(SettingsEntity)
  private readonly settingsRepository: Repository<SettingsEntity>;
  @InjectRepository(ShipperEntity)
  private readonly shipperRepository: Repository<ShipperEntity>;
  async indexAction() {
    const info = await this.shipperRepository.find({
      where: {
        enabled: 1,
      },
    });
    const set = await this.settingsRepository.findOne({
      where: {
        id: 1,
      },
    });

    const data = {
      info,
      set,
    };
    return data;
  }

  async listAction(payload) {
    const { page = 1, size = 10, name = '1' } = payload;
    const [data, count] = await this.shipperRepository.findAndCount({
      where: [{ name: Like(`%${name}%`) }, { code: Like(`%${name}%`) }],
      order: { sort_order: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });
    return {
      data,
      count,
      pageSize: size,
      currentPage: page,
    };
  }

  async destoryAction(payload) {
    const { id } = payload;
    await this.shipperRepository.delete(id);
  }

  async infoAction(payload) {
    const { id } = payload;
    const data = await this.shipperRepository.findOne({
      where: {
        id,
      },
    });
    return data;
  }

  async storeAction(payload) {
    const { id, ...values } = payload;

    if (id > 0) {
      await this.shipperRepository.update(
        {
          id,
        },
        { ...values },
      );
    } else {
      await this.shipperRepository.insert(values);
    }
    return values;
  }
}
