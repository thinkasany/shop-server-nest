import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_cart')
export class CartEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'user_id' })
  user_id: number;

  @Column({ name: 'goods_id' })
  goods_id: number;

  @Column({ name: 'goods_sn' })
  goods_sn: string;

  @Column({ name: 'product_id' })
  product_id: number;

  @Column({ name: 'goods_name' })
  goods_name: string;

  @Column({ name: 'goods_aka' })
  goods_aka: string;

  @Column({ name: 'goods_weight', type: 'double', precision: 4, scale: 2 })
  goods_weight: number;

  @Column({ name: 'add_price', type: 'decimal', precision: 10, scale: 2 })
  add_price: number;

  @Column({ name: 'retail_price', type: 'decimal', precision: 10, scale: 2 })
  retail_price: number;

  @Column()
  number: number;

  @Column({ name: 'goods_specifition_name_value', type: 'text' })
  goods_specifition_name_value: string;

  @Column({ name: 'goods_specifition_ids' })
  goods_specifition_ids: string;

  @Column()
  checked: number;

  @Column({ name: 'list_pic_url' })
  list_pic_url: string;

  @Column({ name: 'freight_template_id' })
  freight_template_id: number;

  @Column({ name: 'is_on_sale', default: 1 })
  is_on_sale: number;

  @Column({ name: 'add_time' })
  add_time: number;

  @Column({ name: 'is_fast', default: 0 })
  is_fast: number;

  @Column({ name: 'is_delete', default: 0 })
  is_delete: number;
}
