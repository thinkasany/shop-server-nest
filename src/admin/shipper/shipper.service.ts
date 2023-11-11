import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from 'src/api/region/entities/region.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { Repository, Like, Not, In } from 'typeorm';
import { ShopFreightTemplateEntity } from '../goods/entities/freightTemplate.entity';
import { ExceptAreaEntity } from './entities/exceptArea.entity';
import { ExceptAreaDetailEntity } from './entities/exceptAreaDetail.entity';
import { FreightTemplateGroupEntity } from './entities/freightTemplateGroup.entity';
import { ShipperEntity } from './entities/shipper.entity';

@Injectable()
export class ShipperService {
  @InjectRepository(SettingsEntity)
  private readonly settingsRepository: Repository<SettingsEntity>;
  @InjectRepository(ShipperEntity)
  private readonly shipperRepository: Repository<ShipperEntity>;
  @InjectRepository(ShopFreightTemplateEntity)
  private readonly freightTemplateRepository: Repository<ShopFreightTemplateEntity>;
  @InjectRepository(FreightTemplateGroupEntity)
  private readonly freightTemplateGroupRepository: Repository<FreightTemplateGroupEntity>;
  @InjectRepository(RegionEntity)
  private readonly regionRepository: Repository<RegionEntity>;
  @InjectRepository(ExceptAreaEntity)
  private readonly exceptAreaRepository: Repository<ExceptAreaEntity>;
  @InjectRepository(ExceptAreaDetailEntity)
  private readonly exceptAreaDetailRepository: Repository<ExceptAreaDetailEntity>;
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

  async freightAction() {
    const data = await this.freightTemplateRepository.find({
      where: {
        is_delete: 0,
      },
    });
    return data;
  }
  async freightdetailAction(payload) {
    const { id } = payload;
    const data: any = await this.freightTemplateGroupRepository.find({
      where: {
        template_id: id,
        is_delete: 0,
        area: Not(0),
      },
    });
    for (const item of data) {
      const area = item.area;
      if (item.free_by_money > 0) {
        item.freeByMoney = false;
      }
      if (item.free_by_number > 0) {
        item.freeByNumber = false;
      }
      const areaData = (area as string).split(',');
      const info = await this.regionRepository.find({
        where: {
          id: In(areaData),
        },
        select: ['name'],
      });
      item.areaName = info.map((item) => item.name).join(',');
    }
    const defaultData = await this.freightTemplateGroupRepository.find({
      where: {
        template_id: id,
        area: 0,
        is_delete: 0,
      },
    });
    const freight = await this.freightTemplateRepository.findOne({
      where: {
        id,
      },
    });
    const info = {
      freight,
      data,
      defaultData,
    };
    return info;
  }
  async getareadataAction() {
    const all = await this.regionRepository.find({
      where: {
        type: 1,
      },
      select: ['id', 'name'],
    });
    return all;
  }

  async exceptareaAction() {
    const data = await this.exceptAreaRepository.find({
      where: {
        is_delete: 0,
      },
    });
    for (const item of data) {
      const area = item.area;
      const areaData = area.split(',');
      const info = await this.regionRepository.find({
        where: {
          id: In(areaData),
        },
        select: ['name'],
      });
      item.areaName = info.map((item) => item.name).join(',');
    }
    return data;
  }
  async addExceptAreaAction(payload) {
    const { table, info } = payload;
    const data = {
      area: table[0].area.substring(2),
      content: info.content,
    };
    const exceptArea = this.exceptAreaRepository.create(data);
    await this.exceptAreaRepository.save(exceptArea);
  }
  async exceptAreaDeleteAction(payload) {
    const { id } = payload;
    await this.exceptAreaRepository.update(
      {
        id,
      },
      { is_delete: 1 },
    );
    await this.exceptAreaDetailRepository.update(
      {
        except_area_id: id,
      },
      { is_delete: 1 },
    );
  }
  async exceptAreaDetailAction(payload) {
    const { id } = payload;
    const data = await this.exceptAreaRepository.find({
      where: {
        id,
        is_delete: 0,
      },
    });
    console.log('===', data);
  }
}
