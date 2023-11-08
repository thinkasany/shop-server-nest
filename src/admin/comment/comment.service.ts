import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ShopCommentEntity } from 'src/api/goods/entities/comment.entity';
import { Repository, Like } from 'typeorm';

@Injectable()
export class CommentService {
  @InjectRepository(ShopCommentEntity)
  private readonly commentRepository: Repository<ShopCommentEntity>;
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
      if (item.image_url) {
        // item.image_url = JSON.parse(item.image_url as any);
      }
      if (item.enabled === 1) {
        item.enabled = true;
      } else {
        item.enabled = false;
      }
    }
    console.log(data);
    return {
      currentPage: page,
      pageSize: size,
      data,
      count: total,
    };
  }
}
