import { Test, TestingModule } from '@nestjs/testing';
import {
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UsersService } from './users.service';
import { PrismaService } from '../../prisma/prisma.service';
import {
  createMockPrismaService,
  createMockUser,
  createMockBookmark,
  createMockTag,
} from '../test-utils/prisma.mock';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from '../../generated/prisma/client';

// Mock bcrypt
jest.mock('bcryptjs');
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;

describe('UsersService', () => {
  let service: UsersService;
  let prismaService: ReturnType<typeof createMockPrismaService>;

  beforeEach(async () => {
    prismaService = createMockPrismaService();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: prismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createUserDto: CreateUserDto = {
      email: 'newuser@example.com',
      name: 'New User',
      password: 'password123',
    };

    it('should successfully create a new user', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);
      mockedBcrypt.hash.mockResolvedValue('hashedPassword' as never);

      const mockUser = {
        id: 'user-id-1',
        email: createUserDto.email,
        name: createUserDto.name,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
      };

      (prismaService.user.create as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
      });
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
      expect(prismaService.user.create).toHaveBeenCalledWith({
        data: {
          email: createUserDto.email,
          name: createUserDto.name,
          password: 'hashedPassword',
          status: UserStatus.ACTIVE,
        },
        select: {
          id: true,
          email: true,
          name: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw ConflictException when user already exists', async () => {
      const existingUser = createMockUser({ email: createUserDto.email });
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
      await expect(service.create(createUserDto)).rejects.toThrow(
        'User with this email already exists',
      );
      expect(prismaService.user.create).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return all users with bookmark counts', async () => {
      const mockUser1 = {
        id: 'user-id-1',
        email: 'user1@example.com',
        name: 'User 1',
        status: UserStatus.ACTIVE,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        _count: {
          bookmarks: 5,
        },
      };

      const mockUser2 = {
        id: 'user-id-2',
        email: 'user2@example.com',
        name: 'User 2',
        status: UserStatus.ACTIVE,
        created_at: new Date('2024-01-02'),
        updated_at: new Date('2024-01-02'),
        _count: {
          bookmarks: 3,
        },
      };

      (prismaService.user.findMany as jest.Mock).mockResolvedValue([
        mockUser1,
        mockUser2,
      ]);

      const result = await service.findAll();

      expect(result).toEqual([mockUser1, mockUser2]);
      expect(prismaService.user.findMany).toHaveBeenCalledWith({
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });
    });

    it('should return empty array when no users exist', async () => {
      (prismaService.user.findMany as jest.Mock).mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    const userId = 'user-id-1';

    it('should return user with bookmarks when found', async () => {
      const mockTag = createMockTag({ id: 'tag-1', name: 'javascript' });
      const mockBookmark = createMockBookmark({ id: 'bookmark-1' });

      const mockUser = {
        id: userId,
        email: 'user@example.com',
        name: 'Test User',
        status: UserStatus.ACTIVE,
        created_at: new Date('2024-01-01'),
        updated_at: new Date('2024-01-01'),
        bookmarks: [
          {
            ...mockBookmark,
            tags: [mockTag],
          },
        ],
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

      const result = await service.findOne(userId);

      expect(result).toEqual(mockUser);
      expect(prismaService.user.findUnique).toHaveBeenCalledWith({
        where: { id: userId },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
          bookmarks: {
            select: {
              id: true,
              url: true,
              title: true,
              description: true,
              created_at: true,
              tags: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne(userId)).rejects.toThrow(NotFoundException);
      await expect(service.findOne(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });
  });

  describe('update', () => {
    const userId = 'user-id-1';
    const updateUserDto: UpdateUserDto = {
      email: 'newemail@example.com',
      password: 'newpassword123',
    };

    it('should successfully update user email and password', async () => {
      const existingUser = createMockUser({
        id: userId,
        email: 'oldemail@example.com',
      });

      const updatedUser = {
        id: userId,
        email: updateUserDto.email!,
        name: existingUser.name,
        status: UserStatus.ACTIVE,
        created_at: existingUser.created_at,
        updated_at: new Date('2024-01-02'),
      };

      (prismaService.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingUser) // Check user exists
        .mockResolvedValueOnce(null); // Check email not taken

      mockedBcrypt.hash.mockResolvedValue('hashedNewPassword' as never);

      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateUserDto);

      expect(result).toEqual(updatedUser);
      expect(mockedBcrypt.hash).toHaveBeenCalledWith(updateUserDto.password, 10);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: updateUserDto.email,
          password: 'hashedNewPassword',
        },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should update only email when password is not provided', async () => {
      const existingUser = createMockUser({ id: userId });
      const updateDtoEmailOnly: UpdateUserDto = {
        email: 'newemail@example.com',
      };

      const updatedUser = {
        ...existingUser,
        email: updateDtoEmailOnly.email!,
      };

      (prismaService.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(null);

      (prismaService.user.update as jest.Mock).mockResolvedValue(updatedUser);

      const result = await service.update(userId, updateDtoEmailOnly);

      expect(result).toEqual(updatedUser);
      expect(mockedBcrypt.hash).not.toHaveBeenCalled();
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: {
          email: updateDtoEmailOnly.email,
        },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        NotFoundException,
      );
      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when email is already taken by another user', async () => {
      const existingUser = createMockUser({ id: userId });
      const userWithSameEmail = createMockUser({
        id: 'other-user-id',
        email: updateUserDto.email!,
      });

      (prismaService.user.findUnique as jest.Mock)
        .mockResolvedValueOnce(existingUser)
        .mockResolvedValueOnce(userWithSameEmail);

      await expect(service.update(userId, updateUserDto)).rejects.toThrow(
        ConflictException,
      );

      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('activate', () => {
    const userId = 'user-id-1';

    it('should successfully activate an inactive user', async () => {
      const inactiveUser = createMockUser({
        id: userId,
        status: UserStatus.INACTIVE,
      });

      const activatedUser = {
        id: userId,
        email: inactiveUser.email,
        name: inactiveUser.name,
        status: UserStatus.ACTIVE,
        created_at: inactiveUser.created_at,
        updated_at: new Date('2024-01-02'),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(inactiveUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(activatedUser);

      const result = await service.activate(userId);

      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.activate(userId)).rejects.toThrow(NotFoundException);
      await expect(service.activate(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });

    it('should throw BadRequestException when user is already active', async () => {
      const activeUser = createMockUser({
        id: userId,
        status: UserStatus.ACTIVE,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(activeUser);

      await expect(service.activate(userId)).rejects.toThrow(BadRequestException);
      await expect(service.activate(userId)).rejects.toThrow(
        'User is already active',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when trying to activate blocked user', async () => {
      const blockedUser = createMockUser({
        id: userId,
        status: UserStatus.BLOCKED,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(blockedUser);

      await expect(service.activate(userId)).rejects.toThrow(BadRequestException);
      await expect(service.activate(userId)).rejects.toThrow(
        'Cannot activate a blocked user. Please unblock first.',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('deactivate', () => {
    const userId = 'user-id-1';

    it('should successfully deactivate an active user', async () => {
      const activeUser = createMockUser({
        id: userId,
        status: UserStatus.ACTIVE,
      });

      const deactivatedUser = {
        id: userId,
        email: activeUser.email,
        name: activeUser.name,
        status: UserStatus.INACTIVE,
        created_at: activeUser.created_at,
        updated_at: new Date('2024-01-02'),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(activeUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(deactivatedUser);

      const result = await service.deactivate(userId);

      expect(result.status).toBe(UserStatus.INACTIVE);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: UserStatus.INACTIVE },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.deactivate(userId)).rejects.toThrow(NotFoundException);
      await expect(service.deactivate(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });

    it('should throw BadRequestException when user is not active', async () => {
      const inactiveUser = createMockUser({
        id: userId,
        status: UserStatus.INACTIVE,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(inactiveUser);

      await expect(service.deactivate(userId)).rejects.toThrow(BadRequestException);
      await expect(service.deactivate(userId)).rejects.toThrow(
        'Can only deactivate users with ACTIVE status',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('block', () => {
    const userId = 'user-id-1';

    it('should successfully block an active user', async () => {
      const activeUser = createMockUser({
        id: userId,
        status: UserStatus.ACTIVE,
      });

      const blockedUser = {
        id: userId,
        email: activeUser.email,
        name: activeUser.name,
        status: UserStatus.BLOCKED,
        created_at: activeUser.created_at,
        updated_at: new Date('2024-01-02'),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(activeUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(blockedUser);

      const result = await service.block(userId);

      expect(result.status).toBe(UserStatus.BLOCKED);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: UserStatus.BLOCKED },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.block(userId)).rejects.toThrow(NotFoundException);
      await expect(service.block(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });

    it('should throw BadRequestException when user is already blocked', async () => {
      const blockedUser = createMockUser({
        id: userId,
        status: UserStatus.BLOCKED,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(blockedUser);

      await expect(service.block(userId)).rejects.toThrow(BadRequestException);
      await expect(service.block(userId)).rejects.toThrow('User is already blocked');
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });

    it('should throw BadRequestException when user is not active', async () => {
      const inactiveUser = createMockUser({
        id: userId,
        status: UserStatus.INACTIVE,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(inactiveUser);

      await expect(service.block(userId)).rejects.toThrow(BadRequestException);
      await expect(service.block(userId)).rejects.toThrow(
        'Can only block users with ACTIVE status',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('unblock', () => {
    const userId = 'user-id-1';

    it('should successfully unblock a blocked user', async () => {
      const blockedUser = createMockUser({
        id: userId,
        status: UserStatus.BLOCKED,
      });

      const unblockedUser = {
        id: userId,
        email: blockedUser.email,
        name: blockedUser.name,
        status: UserStatus.ACTIVE,
        created_at: blockedUser.created_at,
        updated_at: new Date('2024-01-02'),
      };

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(blockedUser);
      (prismaService.user.update as jest.Mock).mockResolvedValue(unblockedUser);

      const result = await service.unblock(userId);

      expect(result.status).toBe(UserStatus.ACTIVE);
      expect(prismaService.user.update).toHaveBeenCalledWith({
        where: { id: userId },
        data: { status: UserStatus.ACTIVE },
        select: {
          id: true,
          email: true,
          name: true,
          status: true,
          created_at: true,
          updated_at: true,
        },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.unblock(userId)).rejects.toThrow(NotFoundException);
      await expect(service.unblock(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
    });

    it('should throw BadRequestException when user is not blocked', async () => {
      const activeUser = createMockUser({
        id: userId,
        status: UserStatus.ACTIVE,
      });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(activeUser);

      await expect(service.unblock(userId)).rejects.toThrow(BadRequestException);
      await expect(service.unblock(userId)).rejects.toThrow(
        'Can only unblock users with BLOCKED status',
      );
      expect(prismaService.user.update).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const userId = 'user-id-1';

    it('should successfully delete user', async () => {
      const existingUser = createMockUser({ id: userId });

      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(existingUser);
      (prismaService.user.delete as jest.Mock).mockResolvedValue(existingUser);

      const result = await service.remove(userId);

      expect(result.message).toBe('User deleted successfully');
      expect(prismaService.user.delete).toHaveBeenCalledWith({
        where: { id: userId },
      });
    });

    it('should throw NotFoundException when user is not found', async () => {
      (prismaService.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.remove(userId)).rejects.toThrow(NotFoundException);
      await expect(service.remove(userId)).rejects.toThrow(
        `User with ID ${userId} not found`,
      );
      expect(prismaService.user.delete).not.toHaveBeenCalled();
    });
  });
});
