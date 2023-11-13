import { ShopFreightTemplateEntity } from 'src/admin/goods/entities/freightTemplate.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

@Entity('freight_template_detail')
export class FreightTemplateDetailEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => ShopFreightTemplateEntity, { onDelete: 'CASCADE' }) // 定义与 FreightTemplateEntity 的关联
  @JoinColumn({ name: 'template_id' })
  template_id: ShopFreightTemplateEntity;

  @Column({ type: 'int', default: 0, comment: '0位默认' })
  area: number;

  @Column({ type: 'int', default: 0 })
  group_id: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  is_delete: boolean | number;
}
