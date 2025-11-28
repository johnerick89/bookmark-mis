import { Module } from '@nestjs/common';
import { BookmarksService } from './bookmarks.service';
import { BookmarksController } from './bookmarks.controller';
import { PrismaModule } from '../../prisma/prisma.module';
import { TaggingService } from './tagging.service';

@Module({
  imports: [PrismaModule],
  controllers: [BookmarksController],
  providers: [BookmarksService, TaggingService],
  exports: [BookmarksService, TaggingService],
})
export class BookmarksModule {}
