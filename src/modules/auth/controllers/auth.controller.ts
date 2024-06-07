import { JoiValidationPipe } from '@common/pipes';
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import {
  ChangePasswordDto,
  ForgotPasswordDto,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dtos';
import { JwtAccessAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';
import {
  ChangePasswordValidator,
  ForgotPasswordValidator,
  LoginValidator,
  RefreshTokenValidator,
  RegisterValidator,
  ResetPasswordValidator,
} from '../validators';

@Controller('general/auth')
export class AuthController {
  constructor(private readonly _authService: AuthService) {}

  @Post('register')
  async register(
    @Body(new JoiValidationPipe(RegisterValidator)) data: RegisterDto,
  ) {
    return this._authService.register(data);
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new JoiValidationPipe(LoginValidator)) loginDto: LoginDto) {
    try {
      return this._authService.login(loginDto);
    } catch (error) {
      console.log(error);
    }
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new JoiValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    return this._authService.userRefreshToken(data);
  }

  @Post('forgot-password')
  async forgotPassword(
    @Body(new JoiValidationPipe(ForgotPasswordValidator))
    data: ForgotPasswordDto,
  ) {
    return this._authService.forgotPassword(data.email);
  }

  @Post('reset-password')
  async resetPassword(
    @Body(new JoiValidationPipe(ResetPasswordValidator)) data: ResetPasswordDto,
  ) {
    return this._authService.resetPassword(data);
  }

  // After login
  @UseGuards(JwtAccessAuthGuard)
  @Post('update-password')
  async changePassword(
    @Body(new JoiValidationPipe(ChangePasswordValidator))
    data: ChangePasswordDto,
  ) {
    return this._authService.changePassword(data);
  }

  @UseGuards(JwtAccessAuthGuard)
  @Get('profile')
  async getOwnProfile(@Body() id: string) {
    return this._authService.getProfile(id);
  }
}
