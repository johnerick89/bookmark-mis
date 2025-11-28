/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserStatus } from 'generated/prisma/client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(createUserDto: CreateUserDto) {
    const existingUser = await this.prisma.user.findUnique({
      where: { email: createUserDto.email },
    });

    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const user = await this.prisma.user.create({
      data: {
        email: createUserDto.email,
        name: createUserDto.name,
        password: hashedPassword,
        status: UserStatus.ACTIVE as UserStatus,
      },
      select: {
        id: true,
        email: true,
        name: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  }

  async findAll() {
    return this.prisma.user.findMany({
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
  }

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
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

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    console.log('updateUserDto', updateUserDto);
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (updateUserDto.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: updateUserDto.email },
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('User with this email already exists');
      }
    }

    const updateData: { email?: string; password?: string; name?: string } = {};
    if (updateUserDto.email) {
      updateData.email = updateUserDto.email;
    }
    if (updateUserDto.password) {
      updateData.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    if (updateUserDto.name) {
      updateData.name = updateUserDto.name;
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async activate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.status === (UserStatus.ACTIVE as UserStatus)) {
      throw new BadRequestException('User is already active');
    }

    if (user.status === (UserStatus.BLOCKED as UserStatus)) {
      throw new BadRequestException(
        'Cannot activate a blocked user. Please unblock first.',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE as UserStatus },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async deactivate(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.status !== (UserStatus.ACTIVE as UserStatus)) {
      throw new BadRequestException(
        'Can only deactivate users with ACTIVE status',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.INACTIVE as UserStatus },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async block(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.status === (UserStatus.BLOCKED as UserStatus)) {
      throw new BadRequestException('User is already blocked');
    }

    if (user.status !== (UserStatus.ACTIVE as UserStatus)) {
      throw new BadRequestException('Can only block users with ACTIVE status');
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.BLOCKED as UserStatus },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async unblock(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    if (user.status !== (UserStatus.BLOCKED as UserStatus)) {
      throw new BadRequestException(
        'Can only unblock users with BLOCKED status',
      );
    }

    const updatedUser = await this.prisma.user.update({
      where: { id },
      data: { status: UserStatus.ACTIVE as UserStatus },
      select: {
        id: true,
        email: true,
        name: true,
        status: true,
        created_at: true,
        updated_at: true,
      },
    });

    return updatedUser;
  }

  async remove(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    await this.prisma.user.delete({
      where: { id },
    });

    return { message: 'User deleted successfully' };
  }
}
