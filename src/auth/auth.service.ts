import { BadRequestException, Injectable, UnauthorizedException } from "@nestjs/common";
import { UserService } from "../user/user.service";
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from "../user/dto/create-user.dto";
import { User } from "src/user/user.entity";
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService, 
    private jwtService: JwtService
  ) {}

  async validateUser(email, pass) {
    const user = await this.usersService.findOneBy(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }

    const isMatch: boolean = bcrypt.compareSync(pass, user.password);
    if (!isMatch) {
      throw new BadRequestException('Email or Password does not match');
    }

    return user;
  }

  async signIn(user: User) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }

  async signUp(payload: CreateUserDto) {
    const existingUser = await this.usersService.findOneBy(payload.email);
    if (existingUser) {
      throw new BadRequestException('email already exists');
    }
    const hashedPassword = await bcrypt.hash(payload.password, 10);
    const user = new User();
    user.email = payload.email;
    user.password = hashedPassword;
    user.createdAt = payload.createdAt;
    await this.usersService.create(user);
    return user;
  }
  /*
  async signIn(email, pass) {
    const user = await this.usersService.findOneBy(email);
    if (!user || user?.password !== pass) {
      throw new UnauthorizedException();
    }
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
  async signUp(payload: CreateUserDto) {
    const user = new User();
    user.email = payload.email;
    user.password = payload.password;
    user.createdAt = payload.createdAt;
    await this.usersService.create(user);
    return user;
  }*/
}