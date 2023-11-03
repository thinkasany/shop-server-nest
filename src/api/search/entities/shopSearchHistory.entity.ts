// shop-search-history.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_search_history')
@Index('user_id_keyword_index', ['user_id', 'keyword'])
export class ShopSearchHistoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 50 })
  keyword: string;

  @Column({ length: 45, default: '' })
  from: string;

  @Column({ type: 'int', default: 0 })
  add_time: number;

  @Column({ length: 45, nullable: true })
  user_id: string;
}
