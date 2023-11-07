import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_specification')
export class SpecificationEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 60, default: '' })
  name: string;

  @Column({ type: 'tinyint', default: 0 })
  sort_order: number;

  @Column({
    type: 'varchar',
    length: 255,
    default: '0',
    charset: 'utf8',
    collation: 'utf8_general_ci',
    comment: '说明',
  })
  memo: string;
}
