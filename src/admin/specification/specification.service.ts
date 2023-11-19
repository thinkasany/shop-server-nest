/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { GoodsSpecificationEntity } from 'src/api/goods/entities/goodsSpecification.entity';
import { ProductEntity } from 'src/api/goods/entities/product.entity';
import { Repository } from 'typeorm';

@Injectable()
export class SpecificationService {
  @InjectRepository(ProductEntity)
  private readonly productRepository: Repository<ProductEntity>;
  @InjectRepository(GoodsSpecificationEntity)
  private readonly goodsSpecificationRepository: Repository<GoodsSpecificationEntity>;
  async getGoodsSpecAction(payload) {
    const { id } = payload;
    const data = await this.productRepository.find({
      where: {
        goods_id: id,
        is_delete: 0,
      },
    });
    //TODO 这里只有一层，以后如果有多重型号，如一件商品既有颜色又有尺寸时，这里的代码是不对的。以后再写。
    let specification_id = 0;
    for (const item of data) {
      const goods_spec_id = item.goods_specification_ids;
      const specValueData = await this.goodsSpecificationRepository.findOne({
        where: {
          id: Number(goods_spec_id),
          is_delete: 0,
        },
      });
      specification_id = specValueData.specification_id;
      item.value = specValueData.value;
    }
    const dataInfo = {
      specData: data,
      specValue: specification_id,
    };
    return dataInfo;
  }
}
