import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { ExceptAreaEntity } from './exceptArea.entity';

@Entity('shop_except_area_detail')
export class ExceptAreaDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ExceptAreaEntity, { onDelete: 'CASCADE' }) // Define the relationship with the ExceptAreaEntity
  @JoinColumn({ name: 'except_area_id' })
  except_area_id: ExceptAreaEntity;

  @Column({ type: 'int', default: 0, comment: '0位默认' })
  area: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_delete: boolean | number;
}
