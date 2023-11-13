import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_freight_template_group')
export class FreightTemplateGroupEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int', default: 0 })
  template_id: number;

  @Column({ type: 'tinyint', default: 0, comment: '默认，area:0' })
  is_default: number;

  @Column({ type: 'varchar', length: 3000, default: '0', comment: '0位默认' })
  area: string | number;

  @Column({ type: 'int', default: 1 })
  start: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  start_fee: number;

  @Column({ type: 'int', default: 1 })
  add: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: '0.00' })
  add_fee: number;

  @Column({ type: 'tinyint', default: 0, comment: '0没有设置' })
  free_by_number: number | boolean;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    default: '0.00',
    comment: '0没设置',
  })
  free_by_money: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
