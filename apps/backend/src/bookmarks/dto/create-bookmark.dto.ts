import { IsString, IsUrl, IsOptional, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateBookmarkDto {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  url: string;

  @ApiProperty({ example: 'Example Title' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ example: 'This is a description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['tag1', 'tag2'], type: [String] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
