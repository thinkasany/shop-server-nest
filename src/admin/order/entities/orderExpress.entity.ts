import { Entity, PrimaryGeneratedColumn, Column, Index } from 'typeorm';

@Entity('shop_order_express')
@Index('order_id', ['order_id'])
export class OrderExpressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'mediumint' })
  order_id: number;

  @Column({ type: 'mediumint' })
  shipper_id: number;

  @Column({ type: 'varchar', length: 120, comment: '物流公司名称' })
  shipper_name: string;

  @Column({ type: 'varchar', length: 60, comment: '物流公司代码' })
  shipper_code: string;

  @Column({ type: 'varchar', length: 40, comment: '快递单号' })
  logistic_code: string;

  @Column({ type: 'varchar', length: 2000, comment: '物流跟踪信息' })
  traces: string;

  @Column({ type: 'tinyint', default: 0 })
  is_finish: number;

  @Column({ type: 'int', comment: '总查询次数', default: 0 })
  request_count: number;

  @Column({
    type: 'int',
    comment: '最近一次向第三方查询物流信息时间',
    default: 0,
  })
  request_time: number;

  @Column({ type: 'int', comment: '添加时间', default: 0 })
  add_time: number;

  @Column({ type: 'int', comment: '更新时间', default: 0 })
  update_time: number;

  @Column({ type: 'tinyint', default: 0 })
  express_type: number;

  @Column({
    type: 'varchar',
    length: 10,
    comment: '快递的地区编码，如杭州571',
    default: '0',
  })
  region_code: string;
}
