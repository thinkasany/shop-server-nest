/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CartEntity } from 'src/api/cart/entities/cart.entity';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { Repository, MoreThan, LessThan, In, Between } from 'typeorm';
import { ShopUserEntity } from '../user/entities/user.entity';
import { OrderEntity } from './entities/order.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class IndexService {
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  @InjectRepository(ShopUserEntity)
  private readonly userRepository: Repository<ShopUserEntity>;
  @InjectRepository(SettingsEntity)
  private readonly settingsRepository: Repository<SettingsEntity>;
  @InjectRepository(CartEntity)
  private readonly cartRepository: Repository<CartEntity>;
  async indexAction() {
    const goodsOnsale = await this.goodsRepository.count({
      where: {
        is_on_sale: 1,
        is_delete: 0,
      },
    });

    const orderToDelivery = await this.orderRepository.count({
      where: {
        order_status: 300,
      },
    });
    const user = await this.userRepository.count();
    const data = await this.settingsRepository.find({
      select: ['countdown'],
    });

    const timestamp = data[0].countdown;
    const info = {
      user,
      goodsOnsale,
      timestamp,
      orderToDelivery,
    };
    return info;
  }
  async mainAction(payload) {
    const { pindex } = payload;
    const index = Number(pindex);
    const todayTimeStamp =
      (new Date(new Date().setHours(0, 0, 0, 0) as number) as any) / 1000; //今天零点的时间戳
    const yesTimeStamp = todayTimeStamp - 86400; //昨天零点的时间戳
    const sevenTimeStamp = todayTimeStamp - 86400 * 7; //7天前零点的时间戳
    const thirtyTimeStamp = todayTimeStamp - 86400 * 30; //30天前零点的时间戳
    let newUser = 1;
    let oldUser = 0;
    let addCart = 0;
    let addOrderNum = 0;
    let addOrderSum = 0;
    let payOrderNum = 0;
    let payOrderSum = 0;
    let newData = [];
    let oldData = [];
    if (index === 0) {
      newData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: MoreThan(todayTimeStamp),
        },
      });
      newUser = newData.length;
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: LessThan(todayTimeStamp),
          last_login_time: LessThan(todayTimeStamp),
        },
      });
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await this.cartRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(todayTimeStamp),
        },
      });
      addOrderNum = await this.orderRepository.count({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(todayTimeStamp),
        },
      });
      const order = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(todayTimeStamp),
        },
      });
      addOrderSum = order.reduce((sum, order) => sum + order.actual_price, 0);
      payOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(todayTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      const payOrder = await this.orderRepository.find({
        where: {
          is_delete: 0,
          add_time: MoreThan(todayTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      addOrderSum = payOrder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
    } else if (index === 1) {
      newData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: Between(yesTimeStamp, todayTimeStamp),
        },
      });
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      newUser = newData.length;
      oldData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: LessThan(yesTimeStamp),
          last_login_time: Between(yesTimeStamp, todayTimeStamp),
        },
      });
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await this.cartRepository.count({
        where: {
          is_delete: 0,
          add_time: Between(yesTimeStamp, todayTimeStamp),
        },
      });
      addOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: Between(yesTimeStamp, todayTimeStamp),
        },
      });
      const addOrder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: Between(yesTimeStamp, todayTimeStamp),
        },
      });
      addOrderSum = addOrder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
      payOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: Between(yesTimeStamp, todayTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      console.log('------------321----------');
      console.log(payOrderNum);
      console.log('-----------3321-----------');
      const payorder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: Between(yesTimeStamp, todayTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      payOrderSum = payorder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
      console.log('-----------123-----------');
      console.log(payOrderSum);
      console.log('-----------123-----------');
    } else if (index === 2) {
      newData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: MoreThan(sevenTimeStamp),
        },
      });
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      newUser = newData.length;
      oldData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: LessThan(sevenTimeStamp),
          last_login_time: MoreThan(sevenTimeStamp),
        },
      });
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await this.cartRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(sevenTimeStamp),
        },
      });
      addOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(sevenTimeStamp),
        },
      });
      const addOrder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(sevenTimeStamp),
        },
      });
      addOrderSum = addOrder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
      payOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(sevenTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      const payorder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(sevenTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      payOrderSum = payorder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
    } else if (index === 3) {
      newData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: MoreThan(thirtyTimeStamp),
        },
      });
      for (const item of newData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      newUser = newData.length;
      oldData = await this.userRepository.find({
        where: {
          id: MoreThan(0),
          register_time: LessThan(thirtyTimeStamp),
          last_login_time: MoreThan(thirtyTimeStamp),
        },
      });
      for (const item of oldData) {
        item.nickname = Buffer.from(item.nickname, 'base64').toString();
      }
      oldUser = oldData.length;
      addCart = await this.cartRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(thirtyTimeStamp),
        },
      });
      addOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(thirtyTimeStamp),
        },
      });
      const addOrder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(thirtyTimeStamp),
        },
      });
      addOrderSum = addOrder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
      payOrderNum = await this.orderRepository.count({
        where: {
          is_delete: 0,
          add_time: MoreThan(thirtyTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      const payorder = await this.orderRepository.find({
        select: ['actual_price'],
        where: {
          is_delete: 0,
          add_time: MoreThan(thirtyTimeStamp),
          order_status: In([201, 802, 300, 301]),
        },
      });
      payOrderSum = payorder.reduce(
        (sum, order) => sum + order.actual_price,
        0,
      );
    }
    if (addOrderSum == null) {
      addOrderSum = 0;
    }
    if (payOrderSum == null) {
      payOrderSum = 0;
    }
    if (newData.length > 0) {
      for (const item of newData) {
        item.register_time = dayjs
          .unix(item.register_time)
          .format('YYYY-MM-DD HH:mm:ss');
        item.last_login_time = dayjs
          .unix(item.last_login_time)
          .format('YYYY-MM-DD HH:mm:ss');
      }
    }

    if (oldData.length > 0) {
      for (const item of oldData) {
        item.register_time = dayjs
          .unix(item.register_time)
          .format('YYYY-MM-DD HH:mm:ss');
        item.last_login_time = dayjs
          .unix(item.last_login_time)
          .format('YYYY-MM-DD HH:mm:ss');
      }
    }
    const info = {
      newUser,
      oldUser,
      addCart,
      newData,
      oldData,
      addOrderNum,
      addOrderSum,
      payOrderNum,
      payOrderSum,
    };
    return info;
  }
}
