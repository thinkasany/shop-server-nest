import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_show_settings')
export class ShowSettingsEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'tinyint',
    unsigned: true,
    default: 0,
    comment: '滚动banner',
  })
  banner: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    comment: '是否开启menu,几个图标',
  })
  channel: number;

  @Column({
    type: 'tinyint',
    width: 1,
    default: 0,
    comment: '首页的img图片是否显示',
  })
  index_banner_img: number;

  @Column({ type: 'tinyint', width: 1, default: 0 })
  notice: number;

  @Column({ type: 'tinyint', width: 1, nullable: true })
  comment: number;

  @Column({ type: 'varchar', length: 255, nullable: true })
  title: string;

  @Column({ type: 'varchar', length: 255, nullable: true })
  desc: string;
}
