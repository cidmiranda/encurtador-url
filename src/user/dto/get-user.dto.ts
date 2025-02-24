import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class GetUserDto {
  @IsEmail()
  @ApiProperty()
  email: string;
}
