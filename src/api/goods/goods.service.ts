import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { ShopCommentEntity } from './entities/comment.entity';
import { GoodsEntity } from './entities/good.entity';
import { GoodsGalleryEntity } from './entities/goodsGallery.entity';
import { GoodsSpecificationEntity } from './entities/goodsSpecification.entity';
import { ProductEntity } from './entities/product.entity';
import { SpecificationEntity } from './entities/specification.entity';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { FootprintService } from '../footprint/footprint.service';
import { ShopSearchHistoryEntity } from '../search/entities/shopSearchHistory.entity';
@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity)
    private readonly goodsRepository: Repository<GoodsEntity>,
    @InjectRepository(GoodsGalleryEntity)
    private readonly goodsGalleryRepository: Repository<GoodsGalleryEntity>,
    @InjectRepository(ProductEntity)
    private readonly productRepository: Repository<ProductEntity>,
    @InjectRepository(GoodsSpecificationEntity)
    private readonly goodsSpecificationRepository: Repository<GoodsSpecificationEntity>,
    @InjectRepository(SpecificationEntity)
    private readonly specificationRepository: Repository<SpecificationEntity>,
    @InjectRepository(ShopCommentEntity)
    private readonly commentRepository: Repository<ShopCommentEntity>,
    @InjectRepository(ShopSearchHistoryEntity)
    private readonly shopSearchHistoryEntityRepository: Repository<ShopSearchHistoryEntity>,
    private FootprintService: FootprintService,
  ) {}

  async indexAction() {
    const data = await this.goodsRepository.find();
    return data;
  }

  async countAction() {
    const data = await this.goodsRepository.count({
      where: {
        is_delete: 0,
        is_on_sale: 1,
      },
    });
    return {
      data: {
        goodsCount: data,
      },
    };
  }

  async detailAction(id, userId) {
    const info = await this.goodsRepository.findOne({
      where: { id, is_delete: 0 },
    });
    if (!info) {
      // fixme 全局错误提示
      throw new HttpException('该商品不存在或已下架', 500);
    }
    const gallery = await this.goodsGalleryRepository.find({
      where: { goods_id: id, is_delete: 0 },
      order: { sort_order: 'ASC' },
      take: 6, // 限制结果数量
    });

    // 添加足迹
    await this.FootprintService.addFootprint(userId, id);

    const productList = await this.productRepository.find({
      where: { goods_id: id, is_delete: 0 },
    });
    let goodsNumber = 0;
    for (const item of productList) {
      if (item.goods_number > 0) {
        goodsNumber = goodsNumber + item.goods_number;
      }
    }
    const specificationList = await this.getSpecificationList(id);
    info.goods_number = goodsNumber;
    return {
      info,
      gallery,
      specificationList,
      productList,
    };
  }

  /**
   * 获取商品的规格信息
   * @param goodsId
   * @returns {Promise.<Array>}
   */
  async getSpecificationList(goodsId) {
    // 根据sku商品信息，查找规格值列表
    const info = await this.goodsSpecificationRepository.find({
      where: {
        goods_id: goodsId,
        is_delete: 0,
      },
    });
    for (const item of info) {
      const product: any = await this.productRepository.find({
        where: {
          goods_specification_ids: String(item.id),
          is_delete: 0,
        },
      });
      item.goods_number = product.goods_number;
    }
    const spec_id = info[0].specification_id;
    const specification: any = await this.specificationRepository.find({
      where: { id: spec_id },
    });
    const data = {
      specification_id: spec_id,
      name: specification.name,
      valueList: info,
    };
    return data;
  }

  async commentAction(id) {
    const info = await this.commentRepository.find({
      where: {
        goods_id: id,
        is_delete: 0,
        enabled: 1,
      },
    });
    return info;
  }

  async listAction(payload, userId) {
    const { keyword, sort, order, sales } = payload;
    const whereMap: { [key: string]: any } = {
      is_on_sale: 1,
      is_delete: 0,
    };
    if (keyword) {
      whereMap.name = Like(`%${keyword}%`);
      await this.shopSearchHistoryEntityRepository.insert({
        keyword,
        user_id: userId,
        add_time: Number(new Date().getTime() / 1000),
      });
      //   fixme： TODO 之后要做个判断，这个词在搜索记录中的次数，如果大于某个值，则将他存入keyword
    }
    // 排序
    let orderMap = {};
    if (sort === 'price') {
      // 按价格
      orderMap = {
        retail_price: order,
      };
    } else if (sort === 'sales') {
      // 按价格
      orderMap = {
        sell_volume: sales,
      };
    } else {
      // 按商品添加时间
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      orderMap = {
        sort_order: 'asc',
      };
    }

    const goodsData = await this.goodsRepository.find({
      where: whereMap,
      order: orderMap,
    });
    return goodsData;
  }
}
