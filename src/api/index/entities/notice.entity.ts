import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_notice')
export class NoticeEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, default: '0' })
  content: string;

  @Column({ type: 'int', default: 0 })
  end_time: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_delete: number;
}
