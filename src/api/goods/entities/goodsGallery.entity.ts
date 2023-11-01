import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_goods_gallery')
export class GoodsGalleryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', unsigned: true })
  goods_id: number;

  @Column({ type: 'varchar', length: 255 })
  img_url: string;

  @Column({ type: 'varchar', length: 255 })
  img_desc: string;

  @Column({ type: 'int', unsigned: true })
  sort_order: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
