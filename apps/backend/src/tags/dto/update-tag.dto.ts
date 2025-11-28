import { IsString, MinLength, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTagDto {
  @ApiPropertyOptional({ example: 'typescript' })
  @IsOptional()
  @IsString()
  @MinLength(1)
  name?: string;
}
