import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_notice')
export class ShopNoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: '0' })
  content: string;

  @Column({ type: 'int' })
  end_time: number | string;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
