/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository, In, LessThan } from 'typeorm';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { OrderEntity } from './entities/order.entity';
import { AdminOrderService } from 'src/admin/order/order.service';
import { RegionEntity } from '../region/entities/region.entity';

@Injectable()
export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  @InjectRepository(OrderGoodsEntity)
  private readonly orderGoodsRepository: Repository<OrderGoodsEntity>;
  @InjectRepository(RegionEntity)
  private readonly regionRepository: Repository<RegionEntity>;
  constructor(private AdminOrderService: AdminOrderService) {}
  async listAction(payload) {
    const { size, page, showType } = payload;
    const userId = 1099; // fixme mock
    console.log(size, page, userId);
    const is_delete = 0;
    const status = await this.getOrderStatus(showType);

    const [orderList, count]: [orderList: any, count: number] =
      await this.orderRepository.findAndCount({
        where: {
          user_id: userId,
          is_delete,
          order_type: LessThan(7),
          order_status: In(status),
        },
        select: [
          'id',
          'add_time',
          'actual_price',
          'freight_price',
          'offline_pay',
        ],
        order: {
          add_time: 'desc',
        },
        skip: (page - 1) * size,
        take: size,
      });
    const newOrderList = [];
    for (const item of orderList) {
      // 订单的商品
      item.goodsList = await this.orderGoodsRepository.find({
        where: {
          user_id: userId,
          // order_id: item.id,
          is_delete: 0,
        },
        select: ['id', 'list_pic_url', 'number'],
      });
      item.goodsCount = 0;
      item.goodsList.forEach((v) => {
        item.goodsCount += v.number;
      });
      item.add_time = dayjs
        .unix(await this.getOrderAddTime(item.id))
        .format('YYYY-MM-DD HH:mm:ss');
      // item.dealdone_time = moment.unix(await this.model('order').getOrderAddTime(item.id)).format('YYYY-MM-DD HH:mm:ss');
      // item.add_time =this.timestampToTime(await this.model('order').getOrderAddTime(item.id));
      // 订单状态的处理
      item.order_status_text = await this.AdminOrderService.getOrderStatusText(
        item.id,
      );
      // 可操作的选项
      item.handleOption = await this.getOrderHandleOption(item.id);
      newOrderList.push(item);
    }
    orderList.data = newOrderList;
    return {
      data: orderList,
      count,
      currentPage: page,
      pageSize: size,
    };
  }
  async getOrderStatus(showType) {
    const status = [];
    if (showType == 0) {
      status.push(101, 102, 103, 201, 202, 203, 300, 301, 302, 303, 401);
      // TODO 这里会不会效率不高？
    } else if (showType == 1) {
      // 待付款订单
      status.push(101);
    } else if (showType == 2) {
      // 待发货订单
      status.push(300);
    } else if (showType == 3) {
      // 待收货订单
      status.push(301);
    } else if (showType == 4) {
      // 待评价订单
      status.push(302, 303);
    } else {
      return null;
    }
    return status;
  }
  // 返回创建时间
  async getOrderAddTime(orderId) {
    const orderInfo = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    const add_time = orderInfo.add_time;
    return add_time;
  }
  /**
   * 获取订单可操作的选项
   * @param orderId
   */
  async getOrderHandleOption(orderId) {
    const handleOption = {
      cancel: false, // 取消操作
      delete: false, // 删除操作
      pay: false, // 支付操作
      confirm: false, // 确认收货完成订单操作
      cancel_refund: false,
    };
    const orderInfo = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });

    // 订单流程：下单成功－》支付订单－》发货－》收货－》评论
    // 订单相关状态字段设计，采用单个字段表示全部的订单状态
    // 1xx表示订单取消和删除等状态：  101订单创建成功等待付款、102订单已取消、103订单已取消(自动)
    // 2xx表示订单支付状态：        201订单已付款，等待发货、202订单取消，退款中、203已退款
    // 3xx表示订单物流相关状态：     300订单待发货，301订单已发货，302用户确认收货、303系统自动收货
    // 4xx表示订单完成的状态：      401已收货已评价
    // 5xx表示订单退换货相关的状态：  501已收货，退款退货 TODO
    // 如果订单已经取消或是已完成，则可删除和再次购买
    // if (status == 101) "未付款";
    // if (status == 102) "已取消";
    // if (status == 103) "已取消(系统)";
    // if (status == 201) "已付款";
    // if (status == 300) "待发货";
    // if (status == 301) "已发货";
    // if (status == 302) "已收货";
    // if (status == 303) "已收货(系统)";
    //  TODO 设置一个定时器，自动将有些订单设为完成
    // 订单刚创建，可以取消订单，可以继续支付
    if (orderInfo.order_status === 101 || orderInfo.order_status === 801) {
      handleOption.cancel = true;
      handleOption.pay = true;
    }
    // 如果订单被取消
    if (orderInfo.order_status === 102 || orderInfo.order_status === 103) {
      handleOption.delete = true;
    }
    // 如果订单已付款，没有发货，则可退款操作
    if (orderInfo.order_status === 201) {
      // handleOption.return = true;
    }
    // 如果订单申请退款中，没有相关操作
    if (orderInfo.order_status === 202) {
      handleOption.cancel_refund = true;
    }
    if (orderInfo.order_status === 300) {
    }
    // 如果订单已经退款，则可删除
    if (orderInfo.order_status === 203) {
      handleOption.delete = true;
    }
    // 如果订单已经发货，没有收货，则可收货操作,
    // 此时不能取消订单
    if (orderInfo.order_status === 301) {
      handleOption.confirm = true;
    }
    if (orderInfo.order_status === 401) {
      handleOption.delete = true;
    }
    return handleOption;
  }
  async orderCountAction(payload) {
    const { userId } = payload;
    const toPay = await this.orderRepository.count({
      where: {
        user_id: userId,
        is_delete: 0,
        order_type: LessThan(7),
        order_status: In(['101', '801']),
      },
    });
    const toDelivery = await this.orderRepository.count({
      where: {
        user_id: userId,
        is_delete: 0,
        order_type: LessThan(7),
        order_status: 300,
      },
    });
    const toReceive = await this.orderRepository.count({
      where: {
        user_id: userId,
        is_delete: 0,
        order_type: LessThan(7),
        order_status: 301,
      },
    });
    const newStatus = {
      toPay: toPay,
      toDelivery: toDelivery,
      toReceive: toReceive,
    };
    return newStatus;
  }
  async detailAction(payload) {
    console.log(payload);
    const { orderId } = payload;
    const userId = 1099; // fixme mock
    const orderInfo: any = await this.orderRepository.findOne({
      where: {
        user_id: userId,
        id: orderId,
      },
    });
    const currentTime = Number(new Date().getTime() / 1000);
    if (!orderInfo) {
      throw new HttpException('订单不存在', 500);
    }
    const province_name = await this.regionRepository.findOne({
      where: {
        id: orderInfo.province,
      },
      select: ['name'],
    });

    const city_name = await this.regionRepository.findOne({
      where: {
        id: orderInfo.city,
      },
      select: ['name'],
    });
    const district_name = await this.regionRepository.findOne({
      where: {
        id: orderInfo.district,
      },
      select: ['name'],
    });
    orderInfo.province_name = province_name.name;
    orderInfo.city_name = city_name.name;
    orderInfo.district_name = district_name.name;
    orderInfo.full_region =
      orderInfo.province_name + orderInfo.city_name + orderInfo.district_name;
    orderInfo.postscript = Buffer.from(
      orderInfo.postscript,
      'base64',
    ).toString();
    const orderGoods = await this.orderGoodsRepository.find({
      where: {
        user_id: userId,
        order_id: orderId,
        is_delete: 0,
      },
    });
    let goodsCount = 0;
    for (const gitem of orderGoods) {
      goodsCount += gitem.number;
    }
    // 订单状态的处理
    orderInfo.order_status_text = await this.getOrderStatusText(orderId);
    if (!orderInfo.confirm_time) {
      orderInfo.confirm_time = 0;
    } else {
      orderInfo.confirm_time = dayjs
        .unix(orderInfo.confirm_time)
        .format('YYYY-MM-DD HH:mm:ss');
    }

    if (!orderInfo.dealdone_time) {
      orderInfo.dealdone_time = 0;
    } else {
      orderInfo.dealdone_time = dayjs
        .unix(orderInfo.dealdone_time)
        .format('YYYY-MM-DD HH:mm:ss');
    }

    if (!orderInfo.pay_time) {
      orderInfo.pay_time = 0;
    } else {
      orderInfo.pay_time = dayjs
        .unix(orderInfo.pay_time)
        .format('YYYY-MM-DD HH:mm:ss');
    }

    if (!orderInfo.shipping_time) {
      orderInfo.shipping_time = 0;
    } else {
      orderInfo.confirm_remainTime =
        orderInfo.shipping_time + 10 * 24 * 60 * 60;
      orderInfo.shipping_time = dayjs
        .unix(orderInfo.shipping_time)
        .format('YYYY-MM-DD HH:mm:ss');
    }
    // 订单支付倒计时
    if (orderInfo.order_status === 101 || orderInfo.order_status === 801) {
      // if (moment().subtract(60, 'minutes') < moment(orderInfo.add_time)) {
      orderInfo.final_pay_time = orderInfo.add_time + 24 * 60 * 60; //支付倒计时2小时
      if (orderInfo.final_pay_time < currentTime) {
        //超过时间不支付，更新订单状态为取消
        const updateInfo = {
          order_status: 102,
        };
        await this.orderRepository.update(
          {
            id: orderId,
          },
          updateInfo,
        );
      }
    }
    orderInfo.add_time = dayjs
      .unix(orderInfo.add_time)
      .format('YYYY-MM-DD HH:mm:ss');
    orderInfo.order_status = '';
    // 订单可操作的选择,删除，支付，收货，评论，退换货
    const handleOption = await this.getOrderHandleOption(orderId);
    const textCode = await this.getOrderTextCode(orderId);
    return {
      orderInfo,
      orderGoods,
      handleOption,
      textCode,
      goodsCount,
    };
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
  async getOrderTextCode(orderId) {
    const textCode = {
      pay: false,
      close: false,
      delivery: false,
      receive: false,
      success: false,
      countdown: false,
    };
    const orderInfo = await this.orderRepository.findOne({
      where: {
        id: orderId,
      },
    });
    if (orderInfo.order_status === 101) {
      textCode.pay = true;
      textCode.countdown = true;
    }
    if (orderInfo.order_status === 102 || orderInfo.order_status === 103) {
      textCode.close = true;
    }
    if (orderInfo.order_status === 201 || orderInfo.order_status === 300) {
      //待发货
      textCode.delivery = true;
    }
    if (orderInfo.order_status === 301) {
      //已发货
      textCode.receive = true;
    }
    if (orderInfo.order_status === 401) {
      textCode.success = true;
    }
    return textCode;
  }

  async expressAction(payload) {}
}
