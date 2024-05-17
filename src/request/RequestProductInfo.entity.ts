import { Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Product } from '../product/product.entity';
import { Request } from './request.entity';

export class RequestProductInfo {
  @PrimaryGeneratedColumn()
  id: string;

  @ManyToOne(() => Request, (request) => request.productInfo, { eager: true })
  request: Request;

  @ManyToOne(() => Product)
  product: Product;

  @Column()
  quantity: number;
}
