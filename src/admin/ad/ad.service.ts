import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ShopAdEntity } from './entities/ad.entity';

@Injectable()
export class AdService {
  @InjectRepository(ShopAdEntity)
  private readonly adRepository: Repository<ShopAdEntity>;
  async indexAction(payload) {
    const { page = 1, size = 10 } = payload;
    const [data, total] = await this.adRepository.findAndCount({
      where: { is_delete: 0 },
      order: { id: 'ASC' },
      skip: (page - 1) * size,
      take: size,
    });
    return {
      data,
      count: total,
    };
  }
  async saleStatusAction(payload) {
    const { id, status } = payload;
    let sale = 0;
    if (status === 'true') {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      sale = 1;
    }
    await this.adRepository.update({ id }, { enabled: sale });
  }
}
