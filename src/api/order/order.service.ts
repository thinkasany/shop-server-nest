import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OrderEntity } from './entities/order.entity';

@Injectable()
export class OrderService {
  @InjectRepository(OrderEntity)
  private readonly orderRepository: Repository<OrderEntity>;
  async listAction(payload) {
    const { size, page, userId } = payload;
    console.log(size, page, userId);
    const is_delete = 0;
    const res = await this.orderRepository.find({
      where: { user_id: userId, is_delete },
    });
    console.log(res);
    return `This action returns all order`;
  }
}
