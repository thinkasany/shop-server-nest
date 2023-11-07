import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsEntity } from '../goods/entities/good.entity';
import { CategoryEntity } from './entities/catalog.entity';

@Injectable()
export class CatalogService {
  @InjectRepository(CategoryEntity)
  private readonly categoryRepository: Repository<CategoryEntity>;
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  async indexAction() {
    const data = await this.categoryRepository
      .createQueryBuilder('shop_category')
      .where({ parent_id: 0, is_category: 1 })
      .orderBy('shop_category.sort_order', 'ASC')
      .limit(10)
      .getMany();
    return {
      categoryList: data,
    };
  }

  async currentAction(id) {
    const data = await this.categoryRepository
      .createQueryBuilder('category')
      .where({ id })
      .select([
        'category.id',
        'category.name',
        'category.img_url',
        'category.p_height',
      ])
      .getOne();
    return data;
  }

  async currentlistAction(payload) {
    const { page, size, id } = payload;
    const whereOptions =
      id === 0
        ? { is_on_sale: 1, is_delete: 0 }
        : { is_on_sale: 1, is_delete: 0, category_id: id };
    const [list, total] = await this.goodsRepository
      .createQueryBuilder('goods')
      .where(whereOptions)
      .orderBy('goods.sort_order', 'ASC')
      .select([
        'goods.name',
        'goods.id',
        'goods.goods_brief',
        'goods.min_retail_price',
        'goods.list_pic_url',
        'goods.goods_number',
      ])
      .skip((page - 1) * size)
      .take(size)
      .getManyAndCount();
    return {
      count: total,
      totalPages: 1,
      pageSize: size,
      currentPage: page,
      data: list,
    };
  }
}
