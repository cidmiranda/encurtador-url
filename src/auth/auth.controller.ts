import { Body, Controller, Post, HttpCode, HttpStatus, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { User } from "../user/user.entity";
import { Public } from "./strategy/public-strategy";
import { UserDTO } from "src/user/dto/user.dto";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperation({ summary: "User Login" })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: [User],
  })
  async signIn(@Body() userDTO: UserDTO) {
    const user = await this.authService.validateUser(userDTO.email, userDTO.password);
    return this.authService.signIn(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signup")
  @ApiOperation({ summary: "User Signup" })
  @ApiResponse({
    status: 200,
    description: "The record found",
    type: [User],
  })
  signUp(@Body() userDTO: UserDTO) {
    const payload = {
      email: userDTO.email, 
      password: userDTO.password,
      createdAt: new Date(),
      updatedAt: new Date()
    }
    return this.authService.signUp(payload);
  }
}