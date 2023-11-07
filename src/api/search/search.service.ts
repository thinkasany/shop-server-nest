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
    console.log(1234, userId);

    // 取出输入框默认的关键词
    const defaultKeyword = await this.keywordsRepository.findOne({
      where: { is_default: 1 },
    });
    // 取出热闹关键词
    const hotKeywordList = await this.keywordsRepository.find({
      select: ['keyword'],
    });
    const historyKeywordList = await this.shopSearchHistoryEntity
      .createQueryBuilder('history')
      .select('DISTINCT history.keyword', 'keyword')
      .where('history.user_id = :userId', { userId })
      .getRawMany();

    return {
      defaultKeyword,
      historyKeywordList: historyKeywordList.map((i) => i.keyword),
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
    await this.shopSearchHistoryEntity.delete({ user_id: userId });
  }
}
