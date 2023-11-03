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

  async deleteAction(payload) {
    const { footprintId, userId } = payload;
    await this.footprintRepository.delete({
      user_id: userId,
      id: footprintId,
    });
  }
  async listAction(payload: { size: number; page: number; userId: number }) {
    const { page, size, userId } = payload;

    const list: any = await this.footprintRepository.find({
      where: {
        user_id: userId,
      },
      order: {
        add_time: 'DESC',
      },
      skip: (page - 1) * size,
      take: size,
    });

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

    return {
      data: list,
    };
  }

  async addFootprint(userId, goodsId) {
    const currentTime = Number(new Date().getTime() / 1000);
    if (userId > 0 && goodsId > 0) {
      const info = await this.footprintRepository.findOne({
        where: {
          goods_id: goodsId,
          user_id: userId,
        },
      });
      if (!info) {
        const order = this.footprintRepository.create({
          goods_id: goodsId,
          user_id: userId,
          add_time: currentTime,
        });
        await this.footprintRepository.save(order);
      } else {
        await this.footprintRepository.update(
          {
            goods_id: goodsId,
            user_id: userId,
          },
          {
            add_time: currentTime,
          },
        );
      }
    }
  }
}
