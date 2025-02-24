import { Body, Controller, Post, HttpCode, HttpStatus } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ApiOperation, ApiTags } from "@nestjs/swagger";
import { Public } from "./strategy/public-strategy";
import { UserDTO } from "src/user/dto/user.dto";

@Controller("auth")
@ApiTags("auth")
export class AuthController {
  constructor(private authService: AuthService) {}
  
  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("login")
  @ApiOperation({ summary: "User Login" })
  async signIn(@Body() userDTO: UserDTO) {
    const user = await this.authService.validateUser(userDTO.email, userDTO.password);
    return this.authService.signIn(user);
  }

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post("signup")
  @ApiOperation({ summary: "User Signup" })
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