import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { KeywordsEntity } from './entities/keywords.entity';

@Injectable()
export class SearchService {
  @InjectRepository(KeywordsEntity)
  private readonly keywordsRepository: Repository<KeywordsEntity>;
  async indexAction(userId) {
    // 取出输入框默认的关键词
    const defaultKeyword = await this.keywordsRepository.findOne({
      where: { is_default: 1 },
    });
    // 取出热闹关键词
    console.log(defaultKeyword);

    console.log(userId);
  }

  async helperAction(keyword) {
    console.log('keyword', keyword);
    const keywords = await this.keywordsRepository.find({
      select: ['keyword'],
      where: { keyword: Like(`${keyword}%`) },
      take: 10, // 限制返回的结果数量
    });
    console.log(keywords);
  }

  async clearHistoryAction(userId) {
    console.log(userId);
    // await this.keywordsRepository.delete({});
  }
}
