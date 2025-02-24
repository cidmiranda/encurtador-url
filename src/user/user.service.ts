import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { User } from './user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserRepository)
    private readonly userRepository: UserRepository,
  ) {}

  async findOneBy(email: string): Promise<User | null> {
    return await this.userRepository.findOneBy({ email: email });
  }
  async findOneById(id: number): Promise<User | null> {
    return await this.userRepository.findOneBy({ id });
  }
  async create(createUserDto: CreateUserDto) {
    return this.userRepository.createUser({
      ...createUserDto,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
  }
}
