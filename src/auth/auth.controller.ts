import { Body, Controller, Post, HttpCode, HttpStatus, UseInterceptors, ClassSerializerInterceptor, UseGuards, Request, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Public } from './public-strategy';
import { UserDTO } from '../user/dto/user.dto';
import { LocalAuthGuard } from './local-auth.guard';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('login')
  @ApiOperation({ summary: 'User login' })
  async signIn(@Request() req, @Body() userDTO: UserDTO) {
    return this.authService.signIn(userDTO, req.user.id);
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('signup')
  @ApiOperation({ summary: 'User signup' })
  signUp(@Body() userDTO: UserDTO) {
    const payload = {
      email: userDTO.email,
      password: userDTO.password,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return this.authService.signUp(payload);
  }
}
