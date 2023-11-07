import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { CartEntity } from '../cart/entities/cart.entity';
import { CategoryEntity } from '../catalog/entities/catalog.entity';
import { GoodsEntity } from '../goods/entities/good.entity';
import { AdEntity } from './entities/ad.entity';
import { NoticeEntity } from './entities/notice.entity';

@Injectable()
export class IndexService {
  @InjectRepository(AdEntity)
  private readonly adRepository: Repository<AdEntity>;
  @InjectRepository(NoticeEntity)
  private readonly noticeRepository: Repository<NoticeEntity>;
  @InjectRepository(CategoryEntity)
  private readonly categoryRepository: Repository<CategoryEntity>;
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  @InjectRepository(CartEntity)
  private readonly cartRepository: Repository<CartEntity>;
  async appInfoAction(userId) {
    const banner = await this.adRepository
      .createQueryBuilder('ad')
      .select(['ad.link_type', 'ad.goods_id', 'ad.image_url', 'ad.link'])
      .where({
        enabled: 1,
        is_delete: 0,
      })
      .orderBy('ad.sort_order', 'ASC')
      .getMany();

    const notice = await this.noticeRepository.find({
      where: {
        is_delete: 0,
      },
      select: ['content'],
    });
    const channel = await this.categoryRepository.find({
      where: { is_channel: 1, parent_id: 0 },
      order: { sort_order: 'ASC' },
      select: ['id', 'icon_url', 'name', 'sort_order'],
    });

    const categoryList: any[] = await this.categoryRepository
      .createQueryBuilder('category')
      .select([
        'category.id as id',
        'category.name as name',
        'category.img_url AS banner',
        'category.p_height as height',
      ])
      .where({
        parent_id: 0,
        is_show: 1,
      })
      .orderBy('category.sort_order', 'ASC')
      .getRawMany();
    for (const categoryItem of categoryList) {
      const categoryGoods = await this.goodsRepository.find({
        where: {
          category_id: categoryItem.id,
          goods_number: MoreThanOrEqual(0),
          is_on_sale: 1,
          is_index: 1,
          is_delete: 0,
        },
        select: [
          'id',
          'list_pic_url',
          'is_new',
          'goods_number',
          'name',
          'sell_volume',
          'min_retail_price',
        ],
        order: {
          sort_order: 'ASC',
        },
      });
      categoryItem.goodsList = categoryGoods;
    }
    let cartCount = 0;
    if (userId) {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      cartCount = await this.cartRepository.count({
        where: {
          user_id: userId,
          is_delete: 0,
        },
      });
    }
    console.log('userId', userId);
    return {
      cartCount,
      notice,
      banner,
      channel,
      categoryList,
    };
  }
}
