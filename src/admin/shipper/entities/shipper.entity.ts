export class Shipper {}
import { Entity, PrimaryGeneratedColumn, Column, Unique } from 'typeorm';

@Entity('shop_shipper')
@Unique('shop_shipper_id_uindex', ['id'])
export class ShipperEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 20, default: '', comment: '快递公司名称' })
  name: string;

  @Column({ type: 'varchar', length: 10, default: '', comment: '快递公司代码' })
  code: string;

  @Column({ type: 'int', default: 10, comment: '排序' })
  sort_order: number;

  @Column({ type: 'varchar', length: 100, nullable: true })
  MonthCode: string | null;

  @Column({ type: 'varchar', length: 100, nullable: true })
  CustomerName: string | null;

  @Column({ type: 'tinyint', default: 0 })
  enabled: number;
}
