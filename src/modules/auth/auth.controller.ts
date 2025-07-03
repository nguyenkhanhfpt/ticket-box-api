import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@modules/auth/dtos/req/login.dto';
import { RegisterDto } from '@modules/auth/dtos/req/register.dto';
import { Public, User } from '@decorators';
import { RefreshTokenGuard } from '@guards';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Public()
  @Post('register')
  register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Get('logout')
  logout() {
    return 'Logout';
  }

  /**
   * Refresh token
   * @param user
   */
  @Public()
  @UseGuards(RefreshTokenGuard)
  @Get('refresh')
  refresh(@User() user: any) {
    const { refreshToken, email } = user;

    return this.authService.refresh(email, refreshToken);
  }
}
