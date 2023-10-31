import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_footprint')
export class FootprintEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'goods_id' })
  goodsId: number;

  @Column({ name: 'add_time' })
  addTime: number;
}
