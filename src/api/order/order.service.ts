/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository, In, LessThan } from 'typeorm';
import { OrderGoodsEntity } from '../goods/entities/orderGoods.entity';
import { OrderEntity } from './entities/order.entity';
import { AdminOrderService } from 'src/admin/order/order.service';
import { CartService } from 'src/api/cart/cart.service';
import { RegionEntity } from '../region/entities/region.entity';
import { OrderExpressEntity } from 'src/admin/order/entities/orderExpress.entity';
import { ApiException } from 'src/api-exception.filter';
import { CartEntity } from '../cart/entities/cart.entity';
import { AddressEntity } from '../address/entities/address.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { SettingsEntity } from '../settings/entities/setting.entity';
import { generateOrderNumber } from 'src/utils';

@Injectable()
export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  @InjectRepository(OrderGoodsEntity)
  private readonly orderGoodsRepository: Repository<OrderGoodsEntity>;
  @InjectRepository(RegionEntity)
  private readonly regionRepository: Repository<RegionEntity>;
  @InjectRepository(OrderExpressEntity)
  private readonly orderExpressRepository: Repository<OrderExpressEntity>;
  @InjectRepository(CartEntity)
  private readonly cartRepository: Repository<CartEntity>;
  @InjectRepository(AddressEntity)
  private readonly addressRepository: Repository<AddressEntity>;
  @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>;
  @InjectRepository(SettingsEntity)
  private readonly settingsRepository: Repository<SettingsEntity>;

  constructor(
    private AdminOrderService: AdminOrderService,
    private CartService: CartService,
  ) {}
  async listAction(payload) {
    const { size, page, showType, userId } = payload;
    // const userId = 1099; // fixme mock
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
    const { orderId, userId } = payload;
    // const userId = 1099; // fixme mock
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

  async expressAction(payload) {
    const { orderId } = payload;
    const currentTime = Number(new Date().getTime() / 1000);
    const info = await this.orderExpressRepository.findOne({
      where: {
        order_id: orderId,
      },
    });
    if (!info) {
      throw new ApiException(400, '暂无物流信息', HttpStatus.BAD_REQUEST);
    }
    // 如果is_finish == 1；或者 updateTime 小于 1分钟，
    const updateTime = info.update_time;
    const com = (currentTime - updateTime) / 60;
    const is_finish = info.is_finish;
    const expressInfo = info;
    if (is_finish == 1) {
      return expressInfo;
    } else if (updateTime != 0 && com < 20) {
      return expressInfo;
    } else {
      const shipperCode = expressInfo.shipper_code;
      const expressNo = expressInfo.logistic_code;
      const lastExpressInfo: any = await this.getExpressInfo(
        shipperCode,
        expressNo,
      );
      let deliverystatus = lastExpressInfo.deliverystatus;
      let newUpdateTime = lastExpressInfo.updateTime;
      newUpdateTime = Number(new Date(newUpdateTime).getTime() / 1000);
      deliverystatus = await this.getDeliverystatus(deliverystatus);
      const issign = lastExpressInfo.issign;
      let traces = lastExpressInfo.list;
      traces = JSON.stringify(traces);
      const dataInfo = {
        express_status: deliverystatus,
        is_finish: issign,
        traces: traces,
        update_time: newUpdateTime,
      };
      await this.orderExpressRepository.update(
        {
          order_id: orderId,
        },
        dataInfo,
      );
      const express = await this.orderExpressRepository.find({
        where: {
          order_id: orderId,
        },
      });
      return express;
    }
  }
  async getExpressInfo(shipperCode, expressNo) {}
  async getDeliverystatus(status) {
    if (status === 0) {
      return '快递收件(揽件)';
    } else if (status === 1) {
      return '在途中';
    } else if (status === 2) {
      return '正在派件';
    } else if (status === 3) {
      return '已签收';
    } else if (status === 4) {
      return '派送失败(无法联系到收件人或客户要求择日派送，地址不详或手机号不清)';
    } else if (status === 5) {
      return '疑难件(收件人拒绝签收，地址有误或不能送达派送区域，收费等原因无法正常派送)';
    } else if (status === 6) {
      return '退件签收';
    }
  }

  async orderGoodsAction(payload) {
    const { orderId } = payload;
    const userId = 1099; // fixmock
    if (orderId > 0) {
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
      return orderGoods;
    } else {
      const cartList = await this.cartRepository.find({
        where: {
          user_id: userId,
          checked: 1,
          is_delete: 0,
          is_fast: 0,
        },
      });
      return cartList;
    }
  }
  async submitAction(userId, payload) {
    // 获取收货地址信息和计算运费
    const { addressId, freightPrice, offlinePay, postscript } = payload;
    let { actualPrice } = payload;
    const buffer = Buffer.from(postscript); // 留言
    const checkedAddress = await this.addressRepository.findOne({
      where: {
        id: addressId,
      },
    });
    if (!checkedAddress) {
      throw new HttpException('请选择收货地址', 500);
    }
    // 获取要购买的商品
    const checkedGoodsList = await this.cartRepository.find({
      where: {
        user_id: userId,
        checked: 1,
        is_delete: 0,
      },
    });
    if (!checkedGoodsList) {
      throw new HttpException('请选择商品', 500);
    }
    let checkPrice = 0;
    let checkStock = 0;
    for (const item of checkedGoodsList) {
      const product = await this.productRepository.findOne({
        where: {
          id: item.product_id,
        },
      });

      if (item.number > product.goods_number) {
        checkStock++;
      }
      if (item.retail_price != item.add_price) {
        checkPrice++;
      }
    }
    if (checkStock > 0) {
      throw new HttpException('库存不足，请重新下单', 500);
    }
    if (checkPrice > 0) {
      throw new HttpException('价格发生变化，请重新下单', 500);
    }
    // 获取订单使用的红包
    // 如果有用红包，则将红包的数量减少，当减到0时，将该条红包删除
    // 统计商品总价
    let goodsTotalPrice = 0.0;
    for (const cartItem of checkedGoodsList) {
      goodsTotalPrice += cartItem.number * cartItem.retail_price;
    }
    // 订单价格计算
    const orderTotalPrice = goodsTotalPrice + freightPrice; // 订单的总价
    actualPrice = orderTotalPrice - 0.0; // 减去其它支付的金额后，要实际支付的金额 比如满减等优惠
    const currentTime = Number(new Date().getTime() / 1000);
    let print_info = '';
    for (const item in checkedGoodsList) {
      const i = Number(item) + 1;
      print_info =
        print_info +
        i +
        '、' +
        checkedGoodsList[item].goods_aka +
        '【' +
        checkedGoodsList[item].number +
        '】 ';
    }
    const orderInfo: any = {
      order_sn: generateOrderNumber(),
      user_id: userId,
      // 收货地址和运费
      consignee: checkedAddress.name,
      mobile: checkedAddress.mobile,
      province: checkedAddress.province_id,
      city: checkedAddress.city_id,
      district: checkedAddress.district_id,
      address: checkedAddress.address,
      order_status: 101, // 订单初始状态为 101
      // 根据城市得到运费，这里需要建立表：所在城市的具体运费
      freight_price: freightPrice,
      postscript: buffer.toString('base64'),
      add_time: currentTime,
      goods_price: goodsTotalPrice,
      order_price: orderTotalPrice,
      actual_price: actualPrice,
      change_price: actualPrice,
      print_info: print_info,
      offline_pay: offlinePay,
    };
    // 开启事务，插入订单信息和订单商品
    const orderId = await this.orderRepository.insert(orderInfo);
    orderInfo.id = orderId.raw.insertId;
    if (!orderId) {
      throw new HttpException('订单提交失败', 500);
    }
    // 将商品信息录入数据库
    const orderGoodsData = [];
    for (const goodsItem of checkedGoodsList) {
      orderGoodsData.push({
        user_id: userId,
        order_id: orderId,
        goods_id: goodsItem.goods_id,
        product_id: goodsItem.product_id,
        goods_name: goodsItem.goods_name,
        goods_aka: goodsItem.goods_aka,
        list_pic_url: goodsItem.list_pic_url,
        retail_price: goodsItem.retail_price,
        number: goodsItem.number,
        goods_specifition_name_value: goodsItem.goods_specifition_name_value,
        goods_specifition_ids: goodsItem.goods_specifition_ids,
      });
    }
    await this.orderGoodsRepository.save(orderGoodsData);
    await this.CartService.clearBuyGoods(userId);
    console.log(payload);
    return orderInfo;
  }
}
