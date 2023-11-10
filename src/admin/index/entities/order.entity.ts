import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_order')
@Index('order_sn_index', ['order_sn'], { unique: true })
@Index('user_id_index', ['user_id'])
@Index('order_status_index', ['order_status'])
@Index('shipping_status_index', ['shipping_status'])
@Index('pay_status_index', ['pay_status'])
@Index('pay_id_index', ['pay_id'])
export class OrderEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, default: '' })
  order_sn: string;

  @Column({ type: 'mediumint', unsigned: true, default: 0 })
  user_id: number;

  @Column({
    type: 'smallint',
    unsigned: true,
    default: 0,
    comment: 'Order Status',
  })
  order_status: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: 'Offline Pay Flag',
  })
  offline_pay: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: 'Shipping Status',
  })
  shipping_status: number;

  @Column({ type: 'tinyint', default: 0 })
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

  @Column({ type: 'varchar', length: 255, default: '' })
  address: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  print_info: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  mobile: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  postscript: string;

  @Column({
    type: 'varchar',
    length: 255,
    charset: 'utf8',
    collation: 'utf8_general_ci',
    nullable: true,
  })
  admin_memo: string | null;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
    comment: 'Shipping Fee',
  })
  shipping_fee: number;

  @Column({ type: 'varchar', length: 120, default: '' })
  pay_name: string;

  @Column({
    type: 'varchar',
    charset: 'utf8',
    collation: 'utf8_general_ci',
    default: '0',
  })
  pay_id: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    comment: 'Change Price',
  })
  change_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    unsigned: true,
    default: '0.00',
    comment: 'Actual Price',
  })
  actual_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
    comment: 'Order Price',
  })
  order_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
    comment: 'Goods Price',
  })
  goods_price: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  add_time: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'Pay Time' })
  pay_time: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'Shipping Time' })
  shipping_time: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'Confirm Time' })
  confirm_time: number;

  @Column({
    type: 'int',
    unsigned: true,
    default: 0,
    comment: 'Deal Done Time',
  })
  dealdone_time: number;

  @Column({ type: 'int', unsigned: true, default: 0, comment: 'Freight Price' })
  freight_price: number;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '480.00',
    comment: 'Express Value',
  })
  express_value: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: '需电联客户请优先派送勿放快递柜',
  })
  remark: string;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: 'Order Type',
  })
  order_type: number;

  @Column({ type: 'tinyint', unsigned: true, default: 0, comment: 'Is Delete' })
  is_delete: number;
}
