import { Module } from '@nestjs/common';
import { UrlService } from './url.service';
import { UrlsController } from './url.controller';
import { UrlsRepository } from './url.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Url } from '../url/url.entity';
import { UserService } from '../user/user.service';
import { UserRepository } from '../user/user.repository';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([Url])],
  controllers: [UrlsController],
  providers: [
    UrlService,
    UrlsRepository,
    UserService,
    UserRepository,
    JwtService,
  ],
  exports: [UrlService],
})
export class UrlModule {}
