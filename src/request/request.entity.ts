import { Logist } from 'src/logist/logist.entity';
import { Supplier } from 'src/supplier/supplier.entity';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';

@Entity()
export class Request {
  @PrimaryGeneratedColumn()
  requestId: string;

  @ManyToOne(() => Logist, (logist) => logist.requests, { eager: true })
  logist: Logist;

  @ManyToOne(() => Supplier, (supplier) => supplier.requests, { eager: true })
  supplier: Supplier;

  // @Column()
  // productId: string;

  @Column({ type: 'timestamp' })
  dateOfDelivery: Date;

  @Column()
  addressOfDelivery: string;

  @Column()
  productType: string;

  @Column()
  description: string;
}
