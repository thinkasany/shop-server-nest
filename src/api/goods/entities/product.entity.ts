import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_product')
export class ProductEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumint', unsigned: true })
  goods_id: number;

  @Column({ type: 'varchar', length: 50 })
  goods_specification_ids: string;

  @Column({ type: 'varchar', length: 60 })
  goods_sn: string;

  @Column({ type: 'mediumint', unsigned: true })
  goods_number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, unsigned: true })
  retail_price: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cost: number;

  @Column({ type: 'double', precision: 6, scale: 2 })
  goods_weight: number;

  @Column({ type: 'tinyint', unsigned: true })
  has_change: number;

  @Column({ type: 'varchar', length: 120 })
  goods_name: string;

  @Column({ type: 'tinyint', unsigned: true })
  is_on_sale: number | string;

  @Column({ type: 'tinyint', unsigned: true })
  is_delete: number;
  value: string;
}
