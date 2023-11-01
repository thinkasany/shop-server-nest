import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { GoodsEntity } from './entities/good.entity';
@Injectable()
export class GoodsService {
  constructor(
    @InjectRepository(GoodsEntity)
    private goodsRepository: Repository<GoodsEntity>,
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
}
