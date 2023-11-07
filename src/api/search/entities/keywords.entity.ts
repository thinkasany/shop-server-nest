import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_keywords')
@Index('idx_keyword', ['keyword'], { unique: true })
export class KeywordsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 90, unique: true })
  keyword: string;

  @Column({ type: 'tinyint', default: 0 })
  is_hot: number;

  @Column({ type: 'tinyint', default: 0 })
  is_default: number;

  @Column({ type: 'tinyint', default: 1 })
  is_show: number;

  @Column({ type: 'int', default: 100 })
  sort_order: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  scheme_url: string;

  @Column({ type: 'int', default: 0 })
  type: number;
}
