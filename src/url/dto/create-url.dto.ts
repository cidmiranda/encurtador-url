import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class CreateURLDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  longUrl: string;
}
