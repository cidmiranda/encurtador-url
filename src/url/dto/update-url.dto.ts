import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class UpdateURLDto {

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  longUrl: string;
  
}