import { Column, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ProductType, Supplier } from '../supplier/supplier.entity';
import { Request } from '../request/request.entity';

export class Product {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ default: 0 })
  totalQuantity: number;

  @Column({ default: 0 })
  price: number;

  @Column({ default: true })
  inStock: boolean;

  @Column({ default: '' })
  description: string;

  @Column({ type: 'enum', enum: ProductType })
  type: ProductType;

  @ManyToOne(() => Supplier, (supplier) => supplier.products)
  supplier: Supplier;
}
