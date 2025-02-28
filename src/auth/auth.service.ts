import {
  BadRequestException,
  Injectable
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { User } from '../user/user.entity';
import * as bcrypt from 'bcrypt';
import { UserDTO } from 'src/user/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByEmail(email);
    if (user) {
      const isMatch: boolean = bcrypt.compareSync(pass, user.password);
        if (isMatch) {
          return user;
        }
    }
    return null;
  }

  async signIn(user: any, id: number) {
    const payload = { email: user.email, id: id };
    return {
      access_token: await this.jwtService.sign(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(payload.email);
    if (existingUser) {
      throw new BadRequestException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = new User();
    user.email = payload.email;
    user.password = hashedPassword;
    user.createdAt = payload.createdAt;
    await this.usersService.create(user);
    return user;
  }
}
