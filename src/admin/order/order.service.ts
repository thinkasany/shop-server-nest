import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RegionEntity } from 'src/api/region/entities/region.entity';
import { Repository } from 'typeorm';

@Injectable()
export class OrderService {
  @InjectRepository(RegionEntity)
  private readonly regionRepository: Repository<RegionEntity>;
  async getAllRegionAction() {
    const aData = await this.regionRepository.find({
      where: {
        type: 1,
      },
    });
    const bData = await this.regionRepository.find({
      where: {
        type: 2,
      },
    });
    const cData = await this.regionRepository.find({
      where: {
        type: 3,
      },
    });
    const newData = [];
    for (const item of aData) {
      const children = [];
      for (const bitem of bData) {
        const innerChildren = [];
        for (const citem of cData) {
          if (citem.parent_id == bitem.id) {
            innerChildren.push({
              value: citem.id,
              label: citem.name,
            });
          }
        }
        if (bitem.parent_id == item.id) {
          children.push({
            value: bitem.id,
            label: bitem.name,
            children: innerChildren,
          });
        }
      }
      newData.push({
        value: item.id,
        label: item.name,
        children: children,
      });
    }
    return newData;
  }
}
