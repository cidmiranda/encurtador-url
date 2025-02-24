import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { DataSource, IsNull, Repository } from 'typeorm';
import { CreateURLDto } from './dto/create-url.dto';
import { Url } from './url.entity';
import { isURL } from 'class-validator';
import { nanoid } from 'nanoid';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UrlsRepository extends Repository<Url> {
  constructor(private dataSource: DataSource, private configService: ConfigService) {
    super(Url, dataSource.createEntityManager());
  }

  async createUrl(createURLDto: CreateURLDto, id: string): Promise<Url> {
    const { longUrl } = createURLDto;

    if (!isURL(longUrl)) {
      throw new BadRequestException('String Must be a Valid URL');
    }

    const urlCode = nanoid(6);
    const baseURL = this.configService.get<string>('BASE_URL');

    let urlExists = await this.findOneBy({ longUrl, deletedAt: IsNull() });
    if (urlExists) return urlExists;

    const shortUrl = `${baseURL}/${urlCode}`;
    const url = this.create({
      userId: id,
      urlCode,
      longUrl,
      shortUrl,
      clicks: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    try {
      await this.save(url);
    } catch (err) {
      if (err.code === '23505') {
        throw new ConflictException('Url already exists');
      } else {
        throw new InternalServerErrorException();
      }
    }

    return url;
  }
}