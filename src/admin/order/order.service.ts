/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderGoodsEntity } from 'src/api/goods/entities/orderGoods.entity';
import { RegionEntity } from 'src/api/region/entities/region.entity';
import { SettingsEntity } from 'src/api/settings/entities/setting.entity';
import { Repository, Like, LessThan, In } from 'typeorm';
import { OrderEntity } from '../index/entities/order.entity';
import { ShopUserEntity } from '../user/entities/user.entity';
import { OrderExpressEntity } from './entities/orderExpress.entity';
import * as dayjs from 'dayjs';

@Injectable()
export class AdminOrderService {
  @InjectRepository(RegionEntity)
  private readonly regionRepository: Repository<RegionEntity>;
  @InjectRepository(SettingsEntity)
  private readonly settingsRepository: Repository<SettingsEntity>;
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  @InjectRepository(OrderExpressEntity)
  private readonly orderExpressRepository: Repository<OrderExpressEntity>;
  @InjectRepository(OrderGoodsEntity)
  private readonly orderGoodsRepository: Repository<OrderGoodsEntity>;
  @InjectRepository(ShopUserEntity)
  private readonly userRepository: Repository<ShopUserEntity>;
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

  async indexAction(payload) {
    const {
      status = '',
      logistic_code = '',
      page = 1,
      size = 10,
      consignee = '',
      orderSn = '',
    } = payload;
    let data = [];
    if (logistic_code === '') {
      data = await this.orderRepository.find({
        where: {
          order_sn: Like(`%${orderSn}%`),
          consignee: Like(`%${consignee}%`),
          order_status: In(status),
          order_type: LessThan(7),
        },
        order: {
          id: 'desc',
        },
        skip: (page - 1) * size,
        take: size,
      });
    } else {
      const orderData = await this.orderExpressRepository.findOne({
        where: {
          logistic_code,
        },
      });
      const order_id = orderData.order_id;
      data = await this.orderRepository.find({
        where: {
          id: order_id,
        },
        order: {
          id: 'desc',
        },
        skip: (page - 1) * size,
        take: size,
      });
    }

    for (const item of data) {
      item.goodsList = await this.orderGoodsRepository.find({
        where: {
          order_id: item.id,
          is_delete: 0,
        },
        select: [
          'goods_name',
          'goods_aka',
          'list_pic_url',
          'number',
          'goods_specifition_name_value',
          'retail_price',
        ],
      });
      item.goodsCount = 0;
      item.goodsList.forEach((v) => {
        item.goodsCount += v.number;
      });
      const user = await this.userRepository.findOne({
        where: {
          id: item.user_id,
        },
        select: ['nickname', 'name', 'mobile', 'avatar'],
      });
      if (user) {
        user.nickname = Buffer.from(user.nickname, 'base64').toString();
      } else {
        user.nickname = '已删除';
      }
      item.userInfo = user;
      const province_name = await this.regionRepository.findOne({
        where: {
          id: item.province,
        },
        select: ['name'],
      });
      const city_name = await this.regionRepository.findOne({
        where: {
          id: item.city,
        },
        select: ['name'],
      });
      const district_name = await this.regionRepository.findOne({
        where: {
          id: item.district,
        },
        select: ['name'],
      });
      item.full_region =
        province_name.name + city_name.name + district_name.name;
      item.postscript = Buffer.from(item.postscript, 'base64').toString();
      item.add_time = dayjs.unix(item.add_time).format('YYYY-MM-DD HH:mm:ss');
      if (item.pay_time != 0) {
        item.pay_time = dayjs.unix(item.pay_time).format('YYYY-MM-DD HH:mm:ss');
      } else {
        item.pay_time = 0;
      }
      item.order_status_text = await this.getOrderStatusText(item.id);
      const express = await this.orderExpressRepository.findOne({
        where: {
          order_id: item.id,
        },
      });
      if (express) {
        item.expressInfo = express.shipper_name + express.logistic_code;
      } else {
        item.expressInfo = '';
      }
    }
    return data;
  }

  async getOrderStatusText(orderId) {
    const orderInfo = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    let statusText = '待付款';
    switch (orderInfo.order_status) {
      case 101:
        statusText = '待付款';
        break;
      case 102:
        statusText = '交易关闭';
        break;
      case 103:
        statusText = '交易关闭'; //到时间系统自动取消
        break;
      case 201:
        statusText = '待发货';
        break;
      case 300:
        statusText = '待发货';
        break;
      case 301:
        statusText = '已发货';
        break;
      case 401:
        statusText = '交易成功'; //到时间，未收货的系统自动收货、
        break;
    }
    return statusText;
  }
  async getAutoStatusAction() {
    const status = await this.settingsRepository.findOne({
      where: {
        id: 1,
      },
      select: ['autoDelivery'],
    });

    const info = status.autoDelivery;
    return info;
  }
}
