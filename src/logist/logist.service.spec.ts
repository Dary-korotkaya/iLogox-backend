import { Test, TestingModule } from '@nestjs/testing';
import { LogistService } from './logist.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Logist } from './logist.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

describe('LogistService', () => {
  let service: LogistService;
  let repository: Repository<Logist>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LogistService,
        {
          provide: getRepositoryToken(Logist),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<LogistService>(LogistService);
    repository = module.get<Repository<Logist>>(getRepositoryToken(Logist));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a logist if found', async () => {
      const id = '1';
      const logist = new Logist();
      logist.id = id;

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(logist);

      expect(await service.findOne(id)).toEqual(logist);
    });

    it('should throw NotFoundException if logist not found', async () => {
      const id = '1';

      jest.spyOn(repository, 'findOneBy').mockResolvedValue(null);

      await expect(service.findOne(id)).rejects.toThrow(NotFoundException);
    });
  });
});
