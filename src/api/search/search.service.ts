import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { KeywordsEntity } from './entities/keywords.entity';
import { ShopSearchHistoryEntity } from './entities/shopSearchHistory.entity';

@Injectable()
export class SearchService {
  @InjectRepository(KeywordsEntity)
  private readonly keywordsRepository: Repository<KeywordsEntity>;
  @InjectRepository(ShopSearchHistoryEntity)
  private readonly shopSearchHistoryEntity: Repository<ShopSearchHistoryEntity>;
  async indexAction(userId) {
    // 取出输入框默认的关键词
    const defaultKeyword = await this.keywordsRepository.findOne({
      where: { is_default: 1 },
    });
    // 取出热闹关键词
    const historyKeywordList = await this.keywordsRepository.find({
      select: ['keyword', 'is_hot'],
      take: 10,
    });
    const hotKeywordList = await this.shopSearchHistoryEntity.find({
      where: { user_id: userId },
      select: ['keyword'],
      take: 10,
    });
    return {
      defaultKeyword,
      historyKeywordList,
      hotKeywordList,
    };
  }

  async helperAction(keyword) {
    console.log('keyword', keyword);
    const keywords = await this.keywordsRepository.find({
      select: ['keyword'],
      where: { keyword: Like(`${keyword}%`) },
      take: 10, // 限制返回的结果数量
    });
    return keywords;
  }

  async clearHistoryAction(userId) {
    console.log(userId);
    // await this.keywordsRepository.delete({});
  }
}
