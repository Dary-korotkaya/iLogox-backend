import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Supplier } from '../supplier/supplier.entity';
import { Logist } from '../logist/logist.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @OneToOne(() => Logist, (logist) => logist.user)
  @JoinColumn()
  logist: Logist;

  @OneToOne(() => Supplier, (supplier) => supplier.user)
  @JoinColumn()
  supplier: Supplier;

  @Column()
  fullName: string;

  @Column({ nullable: true })
  dateOfBirth: Date;

  @Column({ unique: true })
  phoneNumber: string;

  @Column()
  email: string;

  @Column({ unique: true })
  login: string;

  @Column()
  password: string;
}
