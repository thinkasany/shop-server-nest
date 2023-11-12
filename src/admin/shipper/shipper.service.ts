import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from 'src/api/region/entities/region.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { Repository, Like, Not, In } from 'typeorm';
import { ShopFreightTemplateEntity } from '../goods/entities/freightTemplate.entity';
import { ExceptAreaEntity } from './entities/exceptArea.entity';
import { ExceptAreaDetailEntity } from './entities/exceptAreaDetail.entity';
import { FreightTemplateDetailEntity } from './entities/freightTemplateDetail.entity';
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
  @InjectRepository(FreightTemplateDetailEntity)
  private readonly freightTemplateDetailRepository: Repository<FreightTemplateDetailEntity>;
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
  async saveTableAction(payload) {
    const { table: data, defaultData: def, info } = payload;
    const idInfo = [];
    // 是已存在的id。如果大于零，则去循环。等于零，则先将已存在的data删除，然后判断，1，data的length > 0.则，说明有新的数据
    for (const item of data) {
      if (item.id > 0) {
        idInfo.push(item.id);
      }
    }

    if (idInfo.length !== 0) {
      console.log('idInfo', idInfo, info);
      const deleData = await this.freightTemplateGroupRepository.find({
        select: ['id'],
        where: {
          id: Not(In(idInfo)),
          template_id: info.id,
          is_default: 0,
          is_delete: 0,
        },
      });
      for (const ele of deleData) {
        await this.freightTemplateDetailRepository.update(
          { template_id: info.id, group_id: ele as any, is_delete: 0 },
          { is_delete: 1 },
        );
      }

      await this.freightTemplateGroupRepository.update(
        {
          id: Not(In(idInfo)),
          template_id: info.id,
          is_default: 0,
          is_delete: 0,
        },
        {
          is_delete: 1,
        },
      );

      for (const item of data) {
        const id = item.id; // 这个是group_id
        if (id > 0) {
          const template_id = info.id;

          const val = {
            area: item.area,
            start: item.start,
            start_fee: item.start_fee,
            add: item.add,
            add_fee: item.add_fee,
            free_by_money: item.free_by_money,
            free_by_number: item.free_by_number,
          };

          await this.freightTemplateGroupRepository.update(
            {
              id,
              template_id: template_id,
              is_delete: 0,
            },
            { ...val },
          );

          // 这里要根据area去notin更新

          const area = item.area;
          const arr = area.split(',');

          await this.freightTemplateDetailRepository.update(
            {
              area: Not(In(arr)),
              template_id: template_id,
              group_id: id,
            },
            { is_delete: 1 },
          );

          for (const item of arr) {
            const e = await this.freightTemplateDetailRepository.find({
              where: {
                template_id: template_id,
                area: item,
                group_id: id,
              },
            });
            if (!e) {
              await this.freightTemplateDetailRepository.insert({
                template_id,
                group_id: id,
                area,
              });
            }
          }
        } else {
          const template_id = info.id;
          const area = item.area.substring(2);
          const val = {
            area: area,
            start: item.start,
            start_fee: item.start_fee,
            add: item.add,
            add_fee: item.add_fee,
            template_id: template_id,
            free_by_money: item.free_by_money,
            free_by_number: item.free_by_number,
          };
          const groupId = await this.freightTemplateGroupRepository.insert(val);
          const areaArr = area.split(',');
          for (const item of areaArr) {
            await this.freightTemplateDetailRepository.insert({
              template_id,
              group_id: groupId as any,
              area: item,
            });
          }
        }
      }
    } else {
      // 这里前台将table全删除了，所以要将原先的数据都删除
      await this.freightTemplateGroupRepository.update(
        {
          template_id: info.id,
          is_default: 0,
          is_delete: 0,
        },
        {
          is_delete: 1,
        },
      );
      // 将detail表也要删除！！！
      if (data.length !== 0) {
        for (const item of data) {
          const area = item.area.substring(2);
          const template_id = info.id;
          const val = {
            area: area,
            start: item.start,
            start_fee: item.start_fee,
            add: item.add,
            add_fee: item.add_fee,
            template_id: template_id,
            free_by_money: item.free_by_money,
            free_by_number: item.free_by_number,
          };
          const groupId = await this.freightTemplateGroupRepository.insert(val);
          //根据area 去循环一下另一张detail表
          const areaArr = area.split(',');
          for (const item of areaArr) {
            await this.freightTemplateDetailRepository.insert({
              template_id: template_id,
              group_id: groupId as any,
              area: item,
            });
          }
        }
      }
    }

    const upData = {
      start: def[0].start,
      start_fee: def[0].start_fee,
      add: def[0].add,
      add_fee: def[0].add_fee,
      free_by_money: def[0].free_by_money,
      free_by_number: def[0].free_by_number,
    };

    await this.freightTemplateGroupRepository.update(
      {
        id: def[0].id,
        template_id: info.id,
        is_default: 1,
      },
      upData,
    );

    const tempData = {
      name: info.name,
      package_price: info.package_price,
      freight_type: info.freight_type,
    };

    await this.freightTemplateRepository.update(
      {
        id: info.id,
      },
      tempData,
    );
    return;
  }
}
