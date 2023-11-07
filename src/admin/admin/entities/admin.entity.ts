import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_admin')
export class ShopAdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 25, default: '' })
  username: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  password: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  password_salt: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  last_login_ip: string;

  @Column({ type: 'int' })
  last_login_time: number | string;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
