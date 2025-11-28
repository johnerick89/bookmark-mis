import { IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTagDto {
  @ApiProperty({ example: 'javascript' })
  @IsString()
  @MinLength(1)
  name: string;
}
