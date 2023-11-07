import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_admin')
export class ShopAdminEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 25 })
  username: string;

  @Column({ length: 255 })
  password: string;

  @Column({ length: 255 })
  password_salt: string;

  @Column({ length: 60 })
  last_login_ip: string;

  @Column({ type: 'int' })
  last_login_time: number;

  @Column({ type: 'tinyint', default: 0 })
  is_delete: number;
}
