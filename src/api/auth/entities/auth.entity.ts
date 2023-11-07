import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_user')
export class UserEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', length: 1024 })
  nickname: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  name: string;

  @Column({ type: 'varchar', length: 60, default: '' })
  username: string;

  @Column({ type: 'varchar', length: 32, default: '' })
  password: string;

  @Column({ type: 'tinyint', unsigned: true, default: 0 })
  gender: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  birthday: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  register_time: number;

  @Column({ type: 'int', unsigned: true, default: 0 })
  last_login_time: number;

  @Column({ type: 'varchar', length: 15, default: '' })
  last_login_ip: string;

  @Column({ type: 'varchar', length: 20 })
  mobile: string;

  @Column({ type: 'varchar', length: 45, default: '' })
  register_ip: string;

  @Column({ type: 'varchar', length: 255, default: '' })
  avatar: string;

  @Column({ type: 'varchar', length: 50, default: '' })
  weixin_openid: string;

  @Column({ type: 'tinyint', default: 0 })
  name_mobile: number;

  @Column({ type: 'varchar', length: 255, default: '0' })
  country: string;

  @Column({ type: 'varchar', length: 100, default: '0' })
  province: string;

  @Column({ type: 'varchar', length: 100, default: '0' })
  city: string;
}
