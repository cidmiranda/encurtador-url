import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateURLDto } from './dto/create-url.dto';
import { GetURLDto } from './dto/get-url.dto';
import { UpdateURLDto } from './dto/update-url.dto';
import { Url } from './url.entity';
import { UrlService } from './url.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../auth/guard/auth.guard';
import { Public } from '../auth/strategy/public-strategy';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { NoCache } from '../interceptor/no-cache.decorator';

@Controller()
@ApiTags('url')
export class UrlsController {
  constructor(
    private readonly urlsService: UrlService,
    private jwtService: JwtService,
  ) {}

  @ApiOperation({ summary: 'Get urls by user' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  getAllUrls(@Headers('Authorization') auth: string): Promise<Url[]> {
    const { sub } = this.jwtService.decode(auth.replace('Bearer ', ''));
    return this.urlsService.getAllURLsByUser(sub);
  }

  @ApiOperation({ summary: 'Create url' })
  @Public()
  @Post()
  createUrl(
    @Headers('Authorization') auth: string | null,
    @Body() createUrlDto: CreateURLDto,
  ): Promise<Url | null> {
    let id;
    if (auth) {
      const { sub } = this.jwtService.decode(auth.replace('Bearer ', ''));
      id = sub;
    }
    return this.urlsService.createUrl(createUrlDto, id);
  }

  @ApiOperation({ summary: 'Update url' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Put('/:id')
  updateUrl(
    @Headers('Authorization') auth: string,
    @Param() getUrlDto: GetURLDto,
    @Body() updateUrlDto: UpdateURLDto,
  ): Promise<Url> {
    return this.urlsService.updateUrl(getUrlDto, updateUrlDto);
  }

  @ApiOperation({ summary: 'Delete url' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/:id')
  deleteLink(@Param() getURLDto: GetURLDto): Promise<void> {
    return this.urlsService.deleteUrl(getURLDto);
  }

  @ApiOperation({ summary: 'Redirect url' })
  @Public()
  @Get('/:code')
  @NoCache()
  async redirect(
    @Param('code') code: string,
    @Res() res: Response,
  ): Promise<void> {
    const url = await this.urlsService.getUrlByCode(code);
    return res.redirect(301, url.longUrl);
  }
}
