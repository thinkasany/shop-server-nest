import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  name: string;

  @Column({ type: 'mediumint', default: 0 })
  user_id: number;

  @Column({ type: 'smallint', default: 0 })
  country_id: number;

  @Column({ type: 'smallint', default: 0 })
  province_id: number;

  @Column({ type: 'smallint', default: 0 })
  city_id: number;

  @Column({ type: 'smallint', default: 0 })
  district_id: number;

  @Column({ type: 'varchar', length: 120, default: '' })
  address: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  mobile: string;

  @Column({ type: 'tinyint', default: 0 })
  is_default: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
