import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';

@Injectable()
export class TagsService {
  constructor(private prisma: PrismaService) {}

  async create(createTagDto: CreateTagDto) {
    const normalizedName = createTagDto.name.trim().toLowerCase();

    const existingTag = await this.prisma.tag.findUnique({
      where: { name: normalizedName },
    });

    if (existingTag) {
      throw new ConflictException('Tag with this name already exists');
    }

    const tag = await this.prisma.tag.create({
      data: { name: normalizedName },
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    return tag;
  }

  async findAll() {
    return this.prisma.tag.findMany({
      include: {
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  async findOne(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
      include: {
        bookmarks: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    return tag;
  }

  async findByName(name: string) {
    const normalizedName = name.trim().toLowerCase();
    const tag = await this.prisma.tag.findUnique({
      where: { name: normalizedName },
      include: {
        bookmarks: {
          include: {
            user: {
              select: {
                id: true,
                email: true,
              },
            },
          },
        },
        _count: {
          select: {
            bookmarks: true,
          },
        },
      },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return tag;
  }

  async update(id: string, updateTagDto: UpdateTagDto) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    if (updateTagDto.name) {
      const normalizedName = updateTagDto.name.trim().toLowerCase();

      const existingTag = await this.prisma.tag.findUnique({
        where: { name: normalizedName },
      });

      if (existingTag && existingTag.id !== id) {
        throw new ConflictException('Tag with this name already exists');
      }

      const updatedTag = await this.prisma.tag.update({
        where: { id },
        data: { name: normalizedName },
        include: {
          _count: {
            select: {
              bookmarks: true,
            },
          },
        },
      });

      return updatedTag;
    }

    return this.findOne(id);
  }

  async remove(id: string) {
    const tag = await this.prisma.tag.findUnique({
      where: { id },
    });

    if (!tag) {
      throw new NotFoundException(`Tag with ID ${id} not found`);
    }

    await this.prisma.tag.delete({
      where: { id },
    });

    return { message: 'Tag deleted successfully' };
  }
}
