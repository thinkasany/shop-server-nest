import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_category')
@Index('parent_id', ['parent_id'])
export class CategoryEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 90, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  keywords: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  front_desc: string;

  @Column({ type: 'int', unsigned: true, default: 0 })
  parent_id: number;

  @Column({ type: 'tinyint', unsigned: true, default: 50 })
  sort_order: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  show_index: number;

  @Column({ type: 'tinyint', unsigned: true, default: 1 })
  is_show: number;

  @Column({ type: 'varchar', length: 255 })
  icon_url: string;

  @Column({ type: 'varchar', length: 255 })
  img_url: string;

  @Column({ type: 'varchar', length: 255 })
  level: string;

  @Column({ type: 'varchar', length: 255 })
  front_name: string;

  @Column({ type: 'int', default: 0 })
  p_height: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_category: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_channel: number;
}
