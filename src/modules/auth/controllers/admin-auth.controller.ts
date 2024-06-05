import { AdminJwtAccessAuthGuard } from './../guards/admin-jwt-access-auth.guard';
import { JoiValidationPipe } from '@common/pipes';
import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { GetStartedDto, LoginDto, RefreshTokenDto } from '../dtos';
import { JwtAccessAuthGuard, LocalAuthGuard } from '../guards';
import { AuthService } from '../services';
import { LoginValidator, RefreshTokenValidator } from '../validators';

@Controller('admin/auth')
export class AdminAuthController {
  constructor(private readonly _authService: AuthService) {}

  // @Post('get-started')
  // async getStarted(
  //   @Body(new JoiValidationPipe(GetStartedValidator)) data: GetStartedDto
  // ) {
  //   return this._authService.adminGetStarted(data);
  // }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Body(new JoiValidationPipe(LoginValidator)) data: LoginDto) {
    return this._authService.adminLogin(data);
  }

  @UseGuards(AdminJwtAccessAuthGuard)
  @Post('refresh-token')
  async refreshToken(
    @Body(new JoiValidationPipe(RefreshTokenValidator)) data: RefreshTokenDto,
  ) {
    return this._authService.adminRefreshToken(data);
  }

  // @UseGuards(AdminJwtAccessAuthGuard)
  // @Post('update-password')
  // async updatePassword(
  //   @Body(new JoiValidationPipe())
  //   data:
  // ) {
  //   return this._authService.changePassword()
  // }
}