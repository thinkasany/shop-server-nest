import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('shop_freight_template')
export class ShopFreightTemplateEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ default: '0' })
  name: string;

  @Column({ default: '0.00' })
  package_price: number;

  @Column({ default: '0' })
  freight_type: number;

  @Column({ default: '0' })
  is_delete: number;
}
