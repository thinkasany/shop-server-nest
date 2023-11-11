import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_except_area')
export class ExceptAreaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 255, comment: '名称' })
  content: string;

  @Column({ type: 'varchar', length: 3000, comment: '0位默认', default: '0' })
  area: string;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_delete: boolean | number;
  areaName: string;
}
