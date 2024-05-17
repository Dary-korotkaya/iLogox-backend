import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

const mockUserRepository = () => ({
  findOneBy: jest.fn(),
  save: jest.fn(),
  findOne: jest.fn(),
});

type MockRepository<T = any> = Partial<Record<keyof Repository<T>, jest.Mock>>;

describe('UserService', () => {
  let service: UserService;
  let userRepository: MockRepository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository(),
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
    userRepository = module.get<MockRepository<User>>(getRepositoryToken(User));
  });

  describe('updateUser', () => {
    it('should update a user successfully', async () => {
      const id = 'some-uuid';
      const userDto = { fullName: 'Updated Name' };
      const user = new User();
      user.id = id;

      userRepository.findOneBy.mockResolvedValue(user);
      userRepository.save.mockResolvedValue({ ...user, ...userDto });

      const result = await service.updateUser(id, userDto);

      expect(result).toBe(true);
      expect(userRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(userRepository.save).toHaveBeenCalledWith({ ...user, ...userDto });
    });

    it('should return false if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      const result = await service.updateUser('some-uuid', {});

      expect(result).toBe(false);
    });
  });

  describe('authenticateUser', () => {
    // it('should return user if credentials are valid', async () => {
    //   const login = 'userLogin';
    //   const password = 'userPassword';
    //   const user = new User();
    //   user.login = login;
    //   user.password = await bcrypt.hash(password, 10);

    //   userRepository.findOneBy.mockResolvedValue(user);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    //   const result = await service.authenticateUser(login, password);

    //   expect(result).toEqual(user);
    //   expect(userRepository.findOneBy).toHaveBeenCalledWith({ login });
    //   expect(bcrypt.compare).toHaveBeenCalledWith(password, user.password);
    // });

    it('should throw UnauthorizedException if user is not found', async () => {
      userRepository.findOneBy.mockResolvedValue(null);

      await expect(service.authenticateUser('userLogin', 'userPassword'))
        .rejects
        .toThrow(UnauthorizedException);
    });

    // it('should throw UnauthorizedException if password does not match', async () => {
    //   const login = 'userLogin';
    //   const user = new User();
    //   user.login = login;
    //   user.password = await bcrypt.hash('correctPassword', 10);

    //   userRepository.findOneBy.mockResolvedValue(user);
    //   jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    //   await expect(service.authenticateUser(login, 'wrongPassword'))
    //     .rejects
    //     .toThrow(UnauthorizedException);
    // });
  });

  describe('findById', () => {
    it('should return user if found', async () => {
      const id = 'some-uuid';
      const user = new User();
      user.id = id;

      userRepository.findOne.mockResolvedValue(user);

      const result = await service.findById(id);

      expect(result).toEqual(user);
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: { supplier: true, logist: true },
      });
    });

    it('should throw NotFoundException if user is not found', async () => {
      userRepository.findOne.mockResolvedValue(null);

      await expect(service.findById('some-uuid'))
        .rejects
        .toThrow(new NotFoundException(`User with ID some-uuid not found`));
    });
  });
});
