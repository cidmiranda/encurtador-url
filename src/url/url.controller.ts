import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { CreateURLDto } from './dto/create-url.dto';
import { GetURLDto } from './dto/get-url.dto';
import { UpdateURLDto } from './dto/update-url.dto';
import { Url } from './url.entity';
import { UrlService } from './url.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from '../auth/public-strategy';
import { Response } from 'express';
import { NoCache } from '../interceptor/no-cache.decorator';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller()
@ApiTags('url')
export class UrlsController {
  constructor(private readonly urlsService: UrlService) {}

  @ApiOperation({ summary: 'Get urls by user' })
  @UseGuards(JwtAuthGuard)
  @Get()
  getAllUrls(@Request() req): Promise<Url[]> {
    return this.urlsService.getAllURLsByUser(req.user.id);
  }

  @ApiOperation({ summary: 'Create url' })
  @UseGuards(JwtAuthGuard)
  @Post()
  createUrl(
    @Request() req,
    @Body() createUrlDto: CreateURLDto,
  ): Promise<Url | null> {
    return this.urlsService.createUrl(createUrlDto, req.user.id);
  }

  @ApiOperation({ summary: 'Update url' })
  @UseGuards(JwtAuthGuard)
  @Put('/:id')
  updateUrl(
    @Param() getUrlDto: GetURLDto,
    @Body() updateUrlDto: UpdateURLDto,
  ): Promise<Url> {
    return this.urlsService.updateUrl(getUrlDto, updateUrlDto);
  }

  @ApiOperation({ summary: 'Delete url' })
  @UseGuards(JwtAuthGuard)
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
