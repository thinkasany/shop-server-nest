import { OrderEntity } from 'src/api/order/entities/order.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('shop_order_goods')
@Index('order_id_index', ['order_id'])
@Index('goods_id_index', ['goods_id'])
export class OrderGoodsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  order_id: number;

  @ManyToOne(() => OrderEntity, (order) => order.goods)
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  goods_id: number;

  @Column({ type: 'varchar', length: 120, default: '' })
  goods_name: string;

  @Column({ type: 'varchar', length: 120 })
  goods_aka: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  product_id: number;

  @Column({ type: 'smallint', unsigned: true, default: 1 })
  number: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0.0 })
  retail_price: number;

  @Column({ type: 'text' })
  goods_specifition_name_value: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  goods_specifition_ids: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  list_pic_url: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  user_id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '是否删除标志',
  })
  is_delete: number;
}
