import { Injectable, NotFoundException } from '@nestjs/common';
import { IsNull } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Url } from './url.entity';
import { CreateURLDto } from './dto/create-url.dto';
import { UrlsRepository } from './url.repository';
import { GetURLDto } from './dto/get-url.dto';
import { UpdateURLDto } from './dto/update-url.dto';

@Injectable()
export class UrlService {
  constructor(
    @InjectRepository(UrlsRepository)
    private readonly urlsRepository: UrlsRepository,
  ) {}

  async getAllURLsByUser(id: string): Promise<Array<Url>> {
    return this.urlsRepository.findBy({ userId: id, deletedAt: IsNull() });
  }

  async createUrl(createLinkDto: CreateURLDto, id: string): Promise<Url> {
    return this.urlsRepository.createUrl(createLinkDto, id);
  }

  async getUrl(id: number): Promise<Url> {
    const url = await this.urlsRepository.findOneBy({
      id,
      deletedAt: IsNull(),
    });

    if (!url) {
      throw new NotFoundException();
    }

    return url;
  }

  async getUrlByCode(code: string): Promise<Url> {
    const url = await this.urlsRepository.findOneBy({
      urlCode: code,
      deletedAt: IsNull(),
    });

    if (!url) {
      throw new NotFoundException();
    }
    await this.updateUrlClick({ id: url.id });
    return url;
  }

  async updateUrl(
    getURLDto: GetURLDto,
    updateURLDto: UpdateURLDto,
  ): Promise<Url> {
    const { id } = getURLDto;
    const url = await this.getUrl(id);
    const { longUrl } = updateURLDto;

    url.longUrl = longUrl;

    await this.urlsRepository.save(url);

    return url;
  }

  async updateUrlClick(getURLDto: GetURLDto): Promise<Url> {
    const { id } = getURLDto;
    const result = await this.urlsRepository.update(id, {
      clicks: () => 'clicks + 1',
    });
    return await this.getUrl(id);
  }

  async deleteUrl(getURLDto: GetURLDto): Promise<void> {
    const { id } = getURLDto;
    const url = await this.getUrl(id);

    url.deletedAt = new Date();

    await this.urlsRepository.save(url);
  }
}
