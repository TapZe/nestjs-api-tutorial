import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post("login")
  login(@Body() dto: AuthDto) {
    return this.authService.login(dto);
  }

  @Post("register")
  register(@Body() dto: AuthDto) {
    return this.authService.register(dto);
  }
}
