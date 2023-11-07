import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { Repository, Like } from 'typeorm';
import { ShopUserEntity } from '../user/entities/user.entity';

@Injectable()
export class ShopcartService {
  @InjectRepository(CartEntity)
  private readonly cartRepository: Repository<CartEntity>;
  @InjectRepository(ShopUserEntity)
  private readonly userRepository: Repository<ShopUserEntity>;

  async indexAction(paylood) {
    const { page = 1, size = 10, name } = paylood;

    const [data, total] = await this.cartRepository.findAndCount({
      where: {
        goods_name: Like(`%${name}%`),
      },
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * size,
      take: size,
    });
    for (const item of data) {
      (item as any).add_time = dayjs
        .unix(item.add_time as number)
        .format('YYYY-MM-DD HH:mm:ss');
      const userInfo = await this.userRepository.findOne({
        where: { id: item.user_id },
      });

      if (userInfo) {
        item.nickname = Buffer.from(userInfo.nickname, 'base64').toString();
      } else {
        item.nickname = '已删除';
      }
    }
    return {
      currentPage: page,
      pageSize: size,
      data,
      count: total,
    };
  }
}
