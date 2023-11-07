import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_ad')
export class ShopAdEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint', default: 0, comment: '0商品，1链接' })
  link_type: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  link: string;

  @Column({ type: 'int', default: 0 })
  goods_id: number;

  @Column({ type: 'text' })
  image_url: string;

  @Column({ type: 'int', default: 0 })
  end_time: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  enabled: number;

  @Column({ type: 'tinyint', default: 0 })
  sort_order: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
