import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { Request } from '../request/request.entity';
import { User } from '../user/user.entity';
import { Product } from '../product/product.entity';

export enum ProductType {
  FRUITS_AND_VEGETABLES = 'Fruits and vegetables',
  DAIRY_PRODUCTS = 'Dairy products',
  MEAT = 'Meat and poultry',
  FISH = 'Fish and seafood',
  BAKERY_PRODUCTS = 'Bakery products',
  CANNED_FOOD = 'Canned food',
  FROZEN_FOOD = 'Frozen food',
  SWEETS = 'Sweets and snacks',
  BEVERAGES = 'Beverages',
  SPICES = 'Spices and seasonings',
}

@Entity()
export class Supplier {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToOne(() => User, (user) => user.supplier)
  user: User;

  @Column()
  companyName: string;

  @Column()
  companyAddress: string;

  @Column({ type: 'enum', enum: ProductType })
  productType: ProductType;

  @OneToMany(() => Request, (request) => request.supplier)
  requests: Request[];

  @OneToMany(() => Product, (product) => product.supplier)
  products: Product[];
}
