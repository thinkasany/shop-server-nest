import { Injectable } from '@nestjs/common';
import { CreateGoodDto } from './dto/create-good.dto';
import { UpdateGoodDto } from './dto/update-good.dto';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
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
    console.log(data);
    return data;
    return 'hello world';
  }
}
