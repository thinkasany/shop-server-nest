import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_goods_specification')
export class GoodsSpecificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  goods_id: number;

  @Column({ type: 'int' })
  specification_id: number;

  @Column({ type: 'varchar', length: 50 })
  value: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  pic_url: string;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
  goods_number: number;
}
