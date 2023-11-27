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

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  country: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  province: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  city: number;

  @Column({ type: 'smallint', unsigned: true, default: 0 })
  district: number;

  @Column({ type: 'varchar', length: 255, default: '0' })
  pay_id: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '订单删除标志',
  })
  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: '0没改价，不等于0改过价格，这里记录原始的价格',
  })
  change_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: '实际需要支付的金额',
  })
  actual_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: '订单总价',
  })
  order_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 0.0,
    comment: '商品总价',
  })
  goods_price: number;

  @Column({ type: 'int' })
  add_time: number;

  @Column({ type: 'int', comment: '付款时间', default: '0' })
  pay_time: number;

  @Column({ type: 'int', comment: '发货时间', default: '0' })
  shipping_time: number;

  @Column({ type: 'int', comment: '确认时间', default: '0' })
  confirm_time: number;

  @Column({
    type: 'int',
    comment: '成交时间，用户评论或自动好评时间',
    default: '0',
  })
  dealdone_time: number;

  @Column({ type: 'int', comment: '配送费用' })
  freight_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: 480.0,
    comment: '顺丰保价金额',
  })
  express_value: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: '需电联客户请优先派送勿放快递柜',
  })
  remark: string;

  @Column({ type: 'tinyint', default: '0' })
  order_type: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
  @Column({ type: 'varchar', length: 255, nullable: false, default: '' })
  postscript: string;
  goods: any;
}
