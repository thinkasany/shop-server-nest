/* eslint-disable @typescript-eslint/no-unused-vars */
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GoodsEntity } from '../goods/entities/good.entity';
import { GoodsSpecificationEntity } from '../goods/entities/goodsSpecification.entity';
import { ProductEntity } from '../goods/entities/product.entity';
import { CartEntity } from './entities/cart.entity';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(CartEntity)
    private readonly cartRepository: Repository<CartEntity>,
    @InjectRepository(GoodsEntity)
    private readonly goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(GoodsSpecificationEntity)
    private readonly goodsSpecificationRepository: Repository<GoodsSpecificationEntity>,
  ) {}
  /** 获取购物车信息，所有对购物车的增删改操作，都要重新返回购物车的信息 */
  async indexAction(userId) {
    return await this.getCart(0, userId);
  }

  // 获取购物车商品的总件件数
  async goodsCountAction(userId) {
    const cartData = await this.getCart(0, userId);
    await this.cartRepository.update(
      {
        user_id: userId,
        is_delete: 0,
        is_fast: 1,
      },
      { is_delete: 1 },
    );
    return {
      cartTotal: {
        goodsCount: cartData.cartTotal.goodsCount,
      },
    };
  }

  async addAction(payload, userId) {
    const { goodsId, productId, number, addType } = payload;
    const currentTime = Number(new Date().getTime() / 1000);
    console.log(goodsId, productId, number, addType);
    console.log(currentTime, userId);
    // 判断商品是否可以购买
    const goodsInfo = await this.goodsRepository.findOne({
      where: {
        id: goodsId,
      },
    });
    if (!goodsInfo || goodsInfo.is_on_sale === 0) {
      throw new HttpException('商品已下架', 500);
    }
    // 取得规格的信息,判断规格库存
    const productInfo = await this.productRepository.findOne({
      where: {
        id: productId,
      },
    });
    if (!productInfo || productInfo.goods_number < number) {
      throw new HttpException('库存不足', 500);
    }
    // 判断购物车中是否存在此规格商品
    const cartInfo = await this.cartRepository.findOne({
      where: {
        user_id: userId,
        product_id: productId,
        is_delete: 0,
      },
    });
    const retail_price = productInfo.retail_price;
    if (addType == 1) {
    } else {
      console.log(cartInfo);

      if (!cartInfo) {
        // 添加操作
        // 添加规格名和值
        let goodsSepcifitionValue = [];
        if (!productInfo?.goods_specification_ids?.length) {
          console.log(goodsSepcifitionValue);
          goodsSepcifitionValue = await this.goodsSpecificationRepository.find({
            where: {
              goods_id: productInfo.goods_id,
              is_delete: 0,
              id: In(
                productInfo.goods_specification_ids.split('_').map(Number),
              ),
            },
            select: ['value'], // 选择你想要返回的字段
          });
        }
        // 添加到购物车
        const cartData = this.cartRepository.create({
          goods_id: productInfo.goods_id,
          product_id: productId,
          goods_sn: productInfo.goods_sn,
          goods_name: goodsInfo.name,
          goods_aka: productInfo.goods_name,
          goods_weight: productInfo.goods_weight,
          freight_template_id: goodsInfo.freight_template_id,
          list_pic_url: goodsInfo.list_pic_url,
          number: number,
          user_id: userId,
          retail_price: retail_price,
          add_price: retail_price,
          goods_specifition_name_value: goodsSepcifitionValue.join(';'),
          goods_specifition_ids: productInfo.goods_specification_ids,
          checked: 1,
          add_time: currentTime,
        });
        await this.cartRepository.save(cartData);
      } else {
        // 如果已经存在购物车中，则数量增加
        console.log('已经存在购物车中，则数量增加');
        if (productInfo.goods_number < number + cartInfo.number) {
          throw new HttpException('库存都不够啦', 500);
        }

        await this.cartRepository.increment(
          {
            user_id: userId,
            product_id: productId,
            is_delete: 0,
            id: cartInfo.id,
          },
          'number', // 要递增的字段
          number, // 要递增的数量
        );
      }
    }
  }
  async getCart(type, userId) {
    console.log(type, userId);
    let cartList = [];
    if (type === 0) {
      cartList = await this.cartRepository.find({
        where: {
          user_id: userId,
          is_delete: 0,
          is_fast: 0,
        },
      });
    } else {
      cartList = await this.cartRepository.find({
        where: {
          user_id: userId,
          is_delete: 0,
          is_fast: 1,
        },
      });
    }
    // 获取购物车统计信息
    const goodsCount = 0;
    return {
      cartList,
      cartTotal: {
        goodsCount,
      },
    };
  }
}
