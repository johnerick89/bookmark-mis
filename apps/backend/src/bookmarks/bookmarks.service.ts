import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateBookmarkDto } from './dto/create-bookmark.dto';
import { UpdateBookmarkDto } from './dto/update-bookmark.dto';
import { PrismaClient } from '../../generated/prisma/client';
import { TaggingService } from './tagging.service';

type BookmarkWithTagsAndUser = PrismaClient['bookmark'] & {
  tags: PrismaClient['tag'][];
  user: PrismaClient['user'];
};

@Injectable()
export class BookmarksService {
  constructor(
    private prisma: PrismaService,
    private taggingService: TaggingService,
  ) {}

  async create(
    createBookmarkDto: CreateBookmarkDto,
    userId: string,
  ): Promise<BookmarkWithTagsAndUser> {
    // Check if URL already exists for this user
    const existingBookmark = await this.prisma.bookmark.findUnique({
      where: { url: createBookmarkDto.url },
    });

    if (existingBookmark && existingBookmark.user_id === userId) {
      throw new ConflictException('Bookmark with this URL already exists');
    }

    const mlTags = await this.taggingService.generateTags(
      createBookmarkDto.url,
      5,
    );

    // Process tags - create or connect them
    const tagConnections = await this.processTags([
      ...mlTags,
      ...(createBookmarkDto.tags || []),
    ]);

    const bookmark = await this.prisma.bookmark.create({
      data: {
        url: createBookmarkDto.url,
        title: createBookmarkDto.title,
        description: createBookmarkDto.description,
        user_id: userId,
        tags: {
          connect: tagConnections.map((tag) => ({ id: tag.id })),
        },
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!bookmark) {
      throw new Error('Failed to create bookmark');
    }

    return bookmark as unknown as BookmarkWithTagsAndUser;
  }

  async findAll(userId?: string) {
    const where = userId ? { user_id: userId } : {};
    return this.prisma.bookmark.findMany({
      where,
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  async findOne(id: string, userId?: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    // If userId is provided, check ownership
    if (userId && bookmark.user_id !== userId) {
      throw new ForbiddenException('You do not have access to this bookmark');
    }

    return bookmark;
  }

  async update(
    id: string,
    updateBookmarkDto: UpdateBookmarkDto,
    userId: string,
  ) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    if (bookmark.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to update this bookmark',
      );
    }

    // Check URL uniqueness if URL is being updated
    if (updateBookmarkDto.url && updateBookmarkDto.url !== bookmark.url) {
      const existingBookmark = await this.prisma.bookmark.findUnique({
        where: { url: updateBookmarkDto.url },
      });

      if (existingBookmark) {
        throw new ConflictException('Bookmark with this URL already exists');
      }
    }

    // Process tags if provided
    const mlTags = await this.taggingService.generateTags(
      updateBookmarkDto.url || bookmark.url,
      5,
    );
    let tagConnections: { id: string }[] = [];

    // Process tags - create or connect them
    if (updateBookmarkDto.tags !== undefined) {
      const allTags = [...mlTags, ...(updateBookmarkDto.tags || [])];
      tagConnections = await this.processTags(allTags);
    }

    const updateData: { url?: string; title?: string; description?: string } =
      {};
    if (updateBookmarkDto.url) updateData.url = updateBookmarkDto.url;
    if (updateBookmarkDto.title) updateData.title = updateBookmarkDto.title;
    if (updateBookmarkDto.description !== undefined) {
      updateData.description = updateBookmarkDto.description;
    }

    const updatedBookmark = await this.prisma.bookmark.update({
      where: { id },
      data: {
        ...updateData,
        ...(updateBookmarkDto.tags !== undefined && {
          tags: {
            set: tagConnections.map((tag) => ({ id: tag.id })),
          },
        }),
      },
      include: {
        tags: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return updatedBookmark;
  }

  async remove(id: string, userId: string) {
    const bookmark = await this.prisma.bookmark.findUnique({
      where: { id },
    });

    if (!bookmark) {
      throw new NotFoundException(`Bookmark with ID ${id} not found`);
    }

    if (bookmark.user_id !== userId) {
      throw new ForbiddenException(
        'You do not have permission to delete this bookmark',
      );
    }

    await this.prisma.bookmark.delete({
      where: { id },
    });

    return { message: 'Bookmark deleted successfully' };
  }

  private async processTags(
    tagNames: string[],
  ): Promise<{ id: string; name: string }[]> {
    const tags: { id: string; name: string }[] = [];

    for (const tagName of tagNames) {
      const normalizedName = tagName.trim().toLowerCase();
      if (!normalizedName) continue;

      let tag = await this.prisma.tag.findUnique({
        where: { name: normalizedName },
      });

      if (!tag) {
        tag = await this.prisma.tag.create({
          data: { name: normalizedName },
        });
      }

      tags.push(tag);
    }

    return tags;
  }
}
