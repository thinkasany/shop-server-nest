/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { OrderEntity } from '../order/entities/order.entity';
import { v3Pay } from 'src/utils';
import { readFileSync } from 'fs';
import * as path from 'path';
const wechatpayConfig = {
  appid: 'wx74862e0dfcf69954', // 公众号 AppID
  mch_id: '1558950191', // 商户号
  notify_url: 'https://example.com/pay/notify', // 支付结果通知网址
  key: readFileSync(
    path.resolve(__dirname, '../../secret/apiclientkey.pem'),
    'utf-8',
  ), // API 密钥
};

@Injectable()
export class IndexService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  @InjectRepository(OrderGoodsEntity)
  private readonly orderGoodsRepository: Repository<OrderGoodsEntity>;
  @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>;
  async preWeixinPayAction(payload) {
    console.log(payload);
    const order = {
      appid: 'wx74862e0dfcf69954', // appid
      mchid: '1558950191', // 商户号
      description: '测试支付',
      out_trade_no: 'wzm202310209122111',
      amount: {
        total: 1,
      },
      notify_url: 'https://xxx.cn/',
    };
    const data = v3Pay(order, '34345964330B66427E0D3D28826C4993C77E631F'); // 证书编号，在商户后台申请证书后
    return data;
    // console.log(wechatpayConfig);
  }
  async preWeixinPayAction1(payload) {
    const { orderId } = payload;
    const orderInfo = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    // 再次确认库存和价格
    const orderGoods = await this.orderGoodsRepository.find({
      where: {
        order_id: orderId,
        is_delete: 0,
      },
    });
    let checkPrice = 0;
    let checkStock = 0;
    for (const item of orderGoods) {
      const product = await this.productRepository.findOne({
        where: {
          id: item.product_id,
        },
      });

      if (item.number > product.goods_number) {
        checkStock++;
      }
      if (item.retail_price != product.retail_price) {
        checkPrice++;
      }
    }
    if (checkStock > 0) {
      throw new HttpException('库存不足，请重新下单', 500);
    }
    if (checkPrice > 0) {
      throw new HttpException('价格发生变化，请重新下单', 500);
    }
    if (!orderInfo) {
      throw new HttpException('订单已取消', 500);
    }
    if (Number(orderInfo.pay_status) !== 0) {
      throw new HttpException('订单已支付，请不要重复操作', 500);
    }
    console.log(payload);
  }
}
