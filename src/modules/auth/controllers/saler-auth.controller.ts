import { SalerJwtAccessAuthGuard } from './../guards/saler-jwt-auth.guard';
import { AdminJwtAccessAuthGuard } from './../guards/admin-jwt-access-auth.guard';
import { JoiValidationPipe } from '@common/pipes';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ChangePasswordDto,
  GetStartedDto,
  LoginDto,
  RefreshTokenDto,
} from '../dtos';
import { JwtAccessAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';
import {
  ChangePasswordValidator,
  GetStartedValidator,
  LoginValidator,
  RefreshTokenValidator,
} from '../validators';

@Controller('saler/auth')
export class SalerAuthController {
  constructor(private readonly _authService: AuthService) {}

  //   @Post('get-started')
  //   async getStarted(
  //     @Body(new JoiValidationPipe(GetStartedValidator)) data: GetStartedDto,
  //   ) {
  //     return this._authService.adminGetStarted(data);
  //   }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new JoiValidationPipe(LoginValidator)) data: LoginDto) {
    return this._authService.salerLogin(data);
  }

  @Post('refresh-token')
  async refreshToken(
    @Body(new JoiValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    return this._authService.salerRefreshToken(data);
  }

  @UseGuards(SalerJwtAccessAuthGuard)
  @Post('update-password')
  async updatePassword(
    @Body(new JoiValidationPipe(ChangePasswordValidator))
    data: ChangePasswordDto,
  ) {
    return this._authService.changePassword(data);
  }
}
