import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository, Like } from 'typeorm';
import { ShopUserEntity } from './entities/user.entity';

@Injectable()
export class UserService {
  @InjectRepository(ShopUserEntity)
  private readonly userRepository: Repository<ShopUserEntity>;
  async indexAction(payload) {
    const { page = 1, size = 10 } = payload;
    let { nickname = '' } = payload;
    nickname = Buffer.from(nickname);
    console.log(page, size, nickname);
    const data = await this.userRepository.find({
      where: { nickname: Like(`%${nickname}%`) },
    });
    for (const item of data) {
      item.register_time = dayjs
        .unix(item.register_time as number)
        .format('YYYY-MM-DD HH:mm:ss');
      item.last_login_time = dayjs
        .unix(item.last_login_time as number)
        .format('YYYY-MM-DD HH:mm:ss');
      item.nickname = Buffer.from(item.nickname, 'base64').toString();
    }
    return {
      userData: {
        data,
      },
    };
  }
}
