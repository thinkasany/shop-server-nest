import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsEntity } from './entities/good.entity';
import { GoodsGalleryEntity } from './entities/goodsGallery.entity';
import { GoodsSpecificationEntity } from './entities/goodsSpecification.entity';
import { ProductEntity } from './entities/product.entity';
import { SpecificationEntity } from './entities/specification.entity';
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
  ) {}

  // private manager: EntityManager;
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

    // fixme: 增加足迹
    // await this.model("footprint").addFootprint(userId, goodsId);
    // console.log(id, userId, info);
    // console.log(id, userId, gallery);
    // console.log(id, userId, productList);

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
}
