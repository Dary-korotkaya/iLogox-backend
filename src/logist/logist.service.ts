import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Logist } from './logist.entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogistService {
  constructor(
    @InjectRepository(Logist)
    private readonly logistRepository: Repository<Logist>,
  ) {}

  async findOne(id: string): Promise<Logist> {
    const logist = this.logistRepository.findOneBy({ id: id });
    if (!logist) {
      throw new NotFoundException('Logist not found');
    }
    return logist;
  }
}
