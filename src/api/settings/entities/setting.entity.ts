// settings.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('shop_settings')
export class SettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'tinyint' })
  autoDelivery: boolean;

  @Column()
  Name: string;

  @Column()
  Tel: string;

  @Column()
  ProvinceName: string;

  @Column()
  CityName: string;

  @Column()
  ExpAreaName: string;

  @Column()
  Address: string;

  @Column({ type: 'int' })
  discovery_img_height: number;

  @Column()
  discovery_img: string;

  @Column({ type: 'int' })
  goods_id: number;

  @Column({ type: 'int' })
  city_id: number;

  @Column({ type: 'int' })
  province_id: number;

  @Column({ type: 'int' })
  district_id: number;

  @Column({ type: 'int' })
  countdown: number;

  @Column({ type: 'tinyint' })
  reset: boolean;
}
