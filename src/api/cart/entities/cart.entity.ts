import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'goods_id' })
  goodsId: number;

  @Column({ name: 'goods_sn' })
  goodsSn: string;

  @Column({ name: 'product_id' })
  productId: number;

  @Column({ name: 'goods_name' })
  goodsName: string;

  @Column({ name: 'goods_aka' })
  goodsAka: string;

  @Column({ name: 'goods_weight', type: 'double', precision: 4, scale: 2 })
  goodsWeight: number;

  @Column({ name: 'add_price', type: 'decimal', precision: 10, scale: 2 })
  addPrice: number;

  @Column({ name: 'retail_price', type: 'decimal', precision: 10, scale: 2 })
  retailPrice: number;

  @Column()
  number: number;

  @Column({ name: 'goods_specifition_name_value', type: 'text' })
  goodsSpecifitionNameValue: string;

  @Column({ name: 'goods_specifition_ids' })
  goodsSpecifitionIds: string;

  @Column()
  checked: number;

  @Column({ name: 'list_pic_url' })
  listPicUrl: string;

  @Column({ name: 'freight_template_id' })
  freightTemplateId: number;

  @Column({ name: 'is_on_sale' })
  isOnSale: number;

  @Column({ name: 'add_time' })
  addTime: number;

  @Column({ name: 'is_fast' })
  isFast: number;

  @Column({ name: 'is_delete' })
  isDelete: number;
}
