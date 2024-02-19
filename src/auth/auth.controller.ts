import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { CredentialsDto } from './dto/credentials.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() createAuth: CredentialsDto) {
    return this.authService.login(createAuth);
  }

  @Post('register')
  register(@Body() createAuth: CredentialsDto) {
    return this.authService.register(createAuth);
  }
}
