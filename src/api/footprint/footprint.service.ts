import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsEntity } from '../goods/entities/good.entity';
import { FootprintEntity } from './entities/footprint.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class FootprintService {
  @InjectRepository(FootprintEntity)
  private readonly footprintRepository: Repository<FootprintEntity>;
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  async listAction(payload: { size: number; page: number; userId: number }) {
    const { page, size, userId } = payload;

    const list: any = await this.footprintRepository
      .createQueryBuilder('f')
      .where({ userId })
      .orderBy('f.addTime', 'DESC')
      .skip((page - 1) * size)
      .take(size)
      .getMany();

    for (const item of list) {
      const goods = await this.goodsRepository.findOne({
        select: [
          'name',
          'goods_brief',
          'retail_price',
          'list_pic_url',
          'goods_number',
          'min_retail_price',
        ],
        where: {
          id: item.goodsId,
        },
      });
      item.goods = goods;
      const isToday = dayjs().isSame(dayjs.unix(item.addTime), 'day');
      if (isToday) {
        item.add_time = '今天';
      }
    }

    return list;
  }
}
