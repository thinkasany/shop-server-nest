import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity('shop_region')
export class RegionEntity {
  @PrimaryGeneratedColumn({ type: 'smallint' })
  id: number;

  @Column({ type: 'smallint', default: 0, name: 'parent_id' })
  parent_id: number;

  @Column({ type: 'varchar', length: 120, default: '' })
  name: string;

  @Column({ type: 'tinyint', default: 2 })
  type: number;

  @Column({ type: 'smallint', default: 0, name: 'agency_id' })
  agency_id: number;

  @Column({ type: 'smallint', default: 0, name: 'area' })
  area: number;

  @Column({ type: 'varchar', length: 10, name: 'area_code', default: '0' })
  area_code: string;

  @Column({ type: 'int', name: 'far_area', default: 0 })
  farArea: number;

  @ManyToOne(() => RegionEntity, (region) => region.children)
  @JoinColumn({ name: 'parent_id' })
  parent: RegionEntity;

  @OneToMany(() => RegionEntity, (region) => region.parent)
  children: RegionEntity[];
}
