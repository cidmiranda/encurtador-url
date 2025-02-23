import {
    Injectable,
    Logger,
    NotFoundException,
  } from '@nestjs/common';
  import { IsNull } from 'typeorm';
  import { InjectRepository } from '@nestjs/typeorm';
  import { Url } from './url.entity';
  import { CreateURLDto  } from './dto/create-url.dto';
  import { UrlsRepository } from './url.repository';
import { GetURLDto } from './dto/get-url.dto';
import { UpdateURLDto } from './dto/update-url.dto';

  @Injectable()
  export class UrlService {
    
    constructor(
        @InjectRepository(UrlsRepository)
        private readonly urlsRepository: UrlsRepository
    ) {}
  
    async getAllURLsByUser(id: string): Promise<Array<Url>> {
        return this.urlsRepository.findBy({userId: id, deletedAt: IsNull()});
    }

    async createUrl(createLinkDto: CreateURLDto, id: string): Promise<Url> {
        return this.urlsRepository.createUrl(createLinkDto, id);
    }
    
    async getUrl(id: number): Promise<Url> {
        const url = await this.urlsRepository.findOneBy({
            id,
            deletedAt: IsNull()
        });

        if (!url) {
            throw new NotFoundException();
        }

        return url;
    }

    async getUrlByCode(code: string): Promise<Url> {
        const logger = new Logger();
        logger.log(`getUrlByCode`);
        const url = await this.urlsRepository.findOneBy({
            urlCode: code, 
            deletedAt: IsNull() 
        });
        
        if (!url) {
            throw new NotFoundException();
        }
        logger.log(`Before Update ${url.id} current clicks: ${url.clicks}`);
        await this.updateUrlClick({id: url.id});
        logger.log(`Update ${url.id} current clicks: ${url.clicks}`);

        return url;
    }

    async updateUrl( getURLDto: GetURLDto, updateURLDto: UpdateURLDto): Promise<Url> {
        
        const { id } = getURLDto;
        const url = await this.getUrl(id);
        const { longUrl } = updateURLDto;
    
        url.longUrl = longUrl;
    
        await this.urlsRepository.save(url);
    
        return url;
    }

    async updateUrlClick( getURLDto: GetURLDto): Promise<Url> {
        const logger = new Logger();
        logger.log(`UpdateUrlClick`);
        const { id } = getURLDto;
        //await this.urlsRepository.increment({ id }, "clicks", 1);
        const result = await this.urlsRepository.update(id, {clicks: () => 'clicks + 1'});
        logger.log(`Update ${result.affected}`);
        return await this.getUrl(id);
    }

    async deleteUrl( getURLDto: GetURLDto): Promise<void> {
        
        const { id } = getURLDto;
        const url = await this.getUrl(id);
    
        url.deletedAt = new Date();
    
        await this.urlsRepository.save(url);
    }
  }