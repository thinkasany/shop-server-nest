import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_address')
export class AddressEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 50, default: '' })
  name: string;

  @Column({ type: 'mediumint' })
  user_id: number;

  @Column({ type: 'smallint' })
  country_id: number;

  @Column({ type: 'smallint' })
  province_id: number;

  @Column({ type: 'smallint' })
  city_id: number;

  @Column({ type: 'smallint' })
  district_id: number;

  @Column({ type: 'varchar', length: 120, default: '' })
  address: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  mobile: string;

  @Column({ type: 'tinyint' })
  is_default: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
