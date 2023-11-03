import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_footprint')
export class FootprintEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'goods_id' })
  goods_id: number;

  @Column({ name: 'add_time' })
  add_time: number;
}
