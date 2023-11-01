import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_order')
@Index('user_id', ['user_id'])
@Index('order_status', ['order_status'])
@Index('shipping_status', ['shipping_status'])
@Index('pay_status', ['pay_status'])
@Index('pay_id', ['pay_id'])
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, default: '' })
  order_sn: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  user_id: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  order_status: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  offline_pay: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  shipping_status: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  print_status: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  pay_status: number;

  @Column({ type: 'varchar', length: 60, default: '' })
  consignee: string;

  @Column({ type: 'varchar', length: 255, default: '0' })
  pay_id: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '订单删除标志',
  })
  is_delete: number;
}
