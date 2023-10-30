import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('xzzshop_goods')
@Index('cat_id', ['category_id'])
@Index('goods_number', ['goods_number'])
@Index('sort_order', ['sort_order'])
export class GoodsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  category_id: number;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  is_on_sale: number;

  @Column({ type: 'varchar', length: 120 })
  name: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  goods_number: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  sell_volume: number;

  @Column({ type: 'varchar', length: 255 })
  keywords: string;

  @Column({ type: 'varchar', length: 100 })
  retail_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  min_retail_price: number;

  @Column({ type: 'varchar', length: 100 })
  cost_price: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  min_cost_price: number;

  @Column({ type: 'varchar', length: 255 })
  goods_brief: string;

  @Column({ type: 'text' })
  goods_desc: string;

  @Column({ type: 'smallint', unsigned: true, default: 100 })
  sort_order: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_index: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_new: number;

  @Column({ type: 'varchar', length: 45, comment: '商品单位' })
  goods_unit: string;

  @Column({ type: 'varchar', length: 255, comment: '商品https图' })
  https_pic_url: string;

  @Column({ type: 'varchar', length: 255, comment: '商品列表图' })
  list_pic_url: string;

  @Column({ type: 'int', default: 0 })
  freight_template_id: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  freight_type: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  is_delete: number;
}
