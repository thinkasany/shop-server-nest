import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopCommentEntity } from 'src/api/goods/entities/comment.entity';
import { GoodsEntity } from 'src/api/goods/entities/good.entity';
import { Repository, Like } from 'typeorm';
import { ShopAdEntity } from '../ad/entities/ad.entity';

@Injectable()
export class CommentService {
  @InjectRepository(ShopCommentEntity)
  private readonly commentRepository: Repository<ShopCommentEntity>;
  @InjectRepository(GoodsEntity)
  private readonly goodsRepository: Repository<GoodsEntity>;
  @InjectRepository(ShopAdEntity)
  private readonly adRepository: Repository<ShopAdEntity>;
  async indexAction(payload) {
    const { page = 1, size = 10, name = '' } = payload;
    const [data, total] = await this.commentRepository.findAndCount({
      where: {
        is_delete: 0,
        goods_id: Like(`%${name}%`),
      },
      order: {
        id: 'DESC',
      },
      skip: (page - 1) * size,
      take: size,
    });
    for (const item of data) {
      if (item.enabled === 1) {
        item.enabled = true;
      } else {
        item.enabled = false;
      }
    }
    return {
      currentPage: page,
      pageSize: size,
      data,
      count: total,
    };
  }

  async infoAction(id) {
    const data = await this.commentRepository.findOne({
      where: { id },
    });
    return data;
  }
  async getallrelateAction() {
    const data = await this.goodsRepository.find({
      where: {
        is_on_sale: 1,
        is_delete: 0,
      },
      select: ['id', 'name', 'list_pic_url'],
    });
    return data;
  }

  async updateSortAction(payload) {
    const { id, sort_order } = payload;
    const data = await this.commentRepository.update({ id }, { sort_order });
    return data;
  }
  async destoryAction(payload) {
    const { id } = payload;
    const data = await this.commentRepository.update({ id }, { sort_order: 1 });
    return data;
  }
  async saleStatusAction(payload) {
    const { id, status } = payload;
    let sale = 0;
    if (status == 'true') {
      sale = 1;
    }
    await this.commentRepository.update(
      {
        id,
      },
      { enabled: sale },
    );
  }
}
