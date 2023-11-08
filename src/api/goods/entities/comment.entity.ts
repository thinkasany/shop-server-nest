import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_comment')
@Index('enabled_index', ['enabled'])
export class ShopCommentEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: '' })
  content: string;

  @Column({ type: 'int' })
  goods_id: number | string;

  @Column({ type: 'json', nullable: true })
  image_url: string[] | string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  enabled: number | boolean;

  @Column({ type: 'tinyint' })
  sort_order: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  avatar: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  name: string;
}
