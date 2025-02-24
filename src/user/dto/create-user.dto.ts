import { ApiProperty } from '@nestjs/swagger';
import { UserDTO } from './user.dto';
export class CreateUserDto extends UserDTO {
  @ApiProperty()
  createdAt: Date;
  @ApiProperty()
  updatedAt: Date;
}
