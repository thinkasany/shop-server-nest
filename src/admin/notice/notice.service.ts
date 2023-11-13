import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as dayjs from 'dayjs';
import { Repository } from 'typeorm';
import { ShopNoticeEntity } from './entities/notice.entity';

@Injectable()
export class NoticeService {
  @InjectRepository(ShopNoticeEntity)
  private readonly noticeRepository: Repository<ShopNoticeEntity>;
  async indexAction() {
    const data = await this.noticeRepository.find();
    for (const item of data) {
      item.end_time = dayjs
        .unix(item.end_time as number)
        .format('YYYY-MM-DD HH:mm:ss');
    }
    return data;
  }

  async updateAction(payload) {
    const { content, id } = payload;
    let { time: end_time } = payload;
    end_time = Number(new Date(end_time).getTime() / 1000);
    const currentTime = Number(new Date().getTime() / 1000);

    const info: { [str: string]: any } = {
      content: content,
      end_time: end_time,
    };

    if (end_time > currentTime) {
      info.is_delete = 0;
    } else {
      info.is_delete = 1;
    }

    const data = await this.noticeRepository.update(
      {
        id,
      },
      { ...info },
    );
    return data;
  }

  async addAction(payload) {
    const { content } = payload;
    let { time: end_time } = payload;
    end_time = Number(new Date(end_time).getTime() / 1000);

    const info = {
      content: content,
      end_time: end_time,
    };
    await this.noticeRepository.insert(info);
  }

  async destoryAction(payload) {
    const { id } = payload;
    await this.noticeRepository.delete({ id });
  }
}
