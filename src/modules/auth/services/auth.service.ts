import * as bcrypt from 'bcryptjs';

import {
  ACCESS_TOKEN,
  ADMIN_ACCESS_TOKEN,
  ADMIN_REFRESH_TOKEN,
  AFFILICATE_ACCESS_TOKEN,
  AFFILICATE_REFRESH_TOKEN,
  REFRESH_TOKEN,
  SALER_ACCESS_TOKEN,
  SALER_REFRESH_TOKEN,
} from '../constants';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  ChangePasswordDto,
  GetStartedDto,
  JwtAccessPayload,
  JwtRefreshPayload,
  LoginDto,
  RefreshTokenDto,
  RegisterDto,
  ResetPasswordDto,
} from '../dtos';
import { JwtPayload, SignOptions, decode, sign } from 'jsonwebtoken';

import { AUTH_ERRORS } from 'src/content/errors/auth.error';
import { AuthQueueService } from './auth-queue.service';
import { CONFIG_VAR } from '@config/index';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { UsersService } from '@modules/users/services/users.service';

export type TokenType =
  | typeof ACCESS_TOKEN
  | typeof REFRESH_TOKEN
  | typeof AFFILICATE_ACCESS_TOKEN
  | typeof AFFILICATE_REFRESH_TOKEN
  | typeof ADMIN_ACCESS_TOKEN
  | typeof ADMIN_REFRESH_TOKEN
  | typeof SALER_ACCESS_TOKEN
  | typeof SALER_REFRESH_TOKEN;

@Injectable()
export class AuthService {
  private readonly _jwtKeys: {
    [ACCESS_TOKEN]: string;
    [REFRESH_TOKEN]: string;
    [ADMIN_ACCESS_TOKEN]: string;
    [ADMIN_REFRESH_TOKEN]: string;
    [SALER_ACCESS_TOKEN]: string;
    [SALER_REFRESH_TOKEN]: string;
  };

  private readonly _jwtOptions: {
    [ACCESS_TOKEN]: SignOptions;
    [REFRESH_TOKEN]: SignOptions;
    [ADMIN_ACCESS_TOKEN]: SignOptions;
    [ADMIN_REFRESH_TOKEN]: SignOptions;
    [SALER_ACCESS_TOKEN]: SignOptions;
    [SALER_REFRESH_TOKEN]: SignOptions;
  };

  constructor(
    private readonly _configService: ConfigService,
    private readonly userService: UsersService,

    private readonly authQueueService: AuthQueueService,
  ) {
    this._jwtKeys = {
      [ACCESS_TOKEN]: this._configService.get(
        CONFIG_VAR.JWT_SECRET,
        'default_secret',
      ),
      [REFRESH_TOKEN]: this._configService.get(
        CONFIG_VAR.JWT_REFRESH_SECRET,
        'default_secret',
      ),
      [ADMIN_ACCESS_TOKEN]: this._configService.get(
        CONFIG_VAR.ADMIN_JWT_SECRET,
        'default_secret',
      ),
      [ADMIN_REFRESH_TOKEN]: this._configService.get(
        CONFIG_VAR.ADMIN_JWT_REFRESH_SECRET,
        'default_secret',
      ),
      [SALER_ACCESS_TOKEN]: _configService.get(
        CONFIG_VAR.SALER_JWT_SECRET,
        'default_secret',
      ),
      [SALER_REFRESH_TOKEN]: _configService.get(
        CONFIG_VAR.SALER_JWT_REFRESH_SECRET,
        'default_secret',
      ),
    };

    this._jwtOptions = {
      [ACCESS_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_EXPIRES_IN),
      },
      [REFRESH_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_REFRESH_EXPIRES_IN),
      },
      [ADMIN_ACCESS_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_EXPIRES_IN),
      },
      [ADMIN_REFRESH_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_REFRESH_EXPIRES_IN),
      },
      [SALER_ACCESS_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_EXPIRES_IN),
      },
      [SALER_REFRESH_TOKEN]: {
        expiresIn: this._configService.get(CONFIG_VAR.JWT_REFRESH_EXPIRES_IN),
      },
    };
  }

  /**
   * Register user with email and password
   * If user is already registered with social login, add local login provider
   */
  async register(data: RegisterDto) {
    const existUser = await this.userService.findByEmail(data.email);
    if (existUser) throw new BadRequestException('Email is already exist');
    const passwordHash = await this._hashPassword(data.password);
    const user: CreateUserDto = {
      email: data.email,
      password: passwordHash,
      firstName: data.firstName ? data.firstName : 'New user',
      lastName: data.lastName ? data.lastName : 'New user',
      adminStatus: 'InActive',
      userStatus: 'Active',
      salerStatus: 'InActive',
      isAdmin: false,
      isUser: true,
      isSaler: false,
    };
    return await this.userService.create(user);
  }

  /**
   * Login user with email and password
   */
  async login(loginDo: LoginDto) {
    const user = await this.userService.findByEmail(loginDo.email);
    if (user.isUser) {
      const jwtAccessPayload: JwtAccessPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin ? 'true' : 'false',
        isUser: user.isUser ? 'true' : 'false',
        isSaler: user.isSaler ? 'true' : 'false',
      };
      const jwtRefreshPayload: JwtRefreshPayload = {
        id: user.id,
      };
      const accessToken = this._signPayload(jwtAccessPayload, ACCESS_TOKEN);
      const refreshToken = this._signPayload(jwtRefreshPayload, REFRESH_TOKEN);
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
  }

  async salerLogin(login: LoginDto) {
    const user = await this.userService.findByEmail(login.email);
    if (user.isSaler) {
      const jwtAccessPayload: JwtAccessPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin ? 'true' : 'false',
        isUser: user.isUser ? 'true' : 'false',
        isSaler: user.isSaler ? 'true' : 'false',
      };
      const jwtRefreshPayload: JwtRefreshPayload = {
        id: user.id,
      };
      const accessToken = this._signPayload(
        jwtAccessPayload,
        SALER_ACCESS_TOKEN,
      );
      const refreshToken = this._signPayload(
        jwtRefreshPayload,
        SALER_REFRESH_TOKEN,
      );
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
  }

  async userRefreshToken(data: RefreshTokenDto) {
    const token = this._decodeToken(data.refresh);
    if (typeof token === 'string' || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = token as JwtRefreshPayload;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const jwtAccessPayload: JwtAccessPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin ? 'true' : 'false',
      isUser: user.isUser ? 'true' : 'false',
      isSaler: user.isSaler ? 'true' : 'false',
    };
    const accessToken = this._signPayload(jwtAccessPayload, ACCESS_TOKEN);
    return {
      accessToken,
    };
  }

  async salerRefreshToken(data: RefreshTokenDto) {
    const token = this._decodeToken(data.refresh);
    if (typeof token === 'string' || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = token as JwtRefreshPayload;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const jwtAccessPayload: JwtAccessPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin ? 'true' : 'false',
      isUser: user.isUser ? 'true' : 'false',
      isSaler: user.isSaler ? 'true' : 'false',
    };
    const accessToken = this._signPayload(jwtAccessPayload, SALER_ACCESS_TOKEN);
    return {
      accessToken,
    };
  }

  async adminRefreshToken(data: RefreshTokenDto) {
    const token = this._decodeToken(data.refresh);
    if (typeof token === 'string' || !token) {
      throw new UnauthorizedException('Invalid token');
    }

    const { id } = token as JwtRefreshPayload;
    const user = await this.userService.findOne(id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const jwtAccessPayload: JwtAccessPayload = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      isAdmin: user.isAdmin ? 'true' : 'false',
      isUser: user.isUser ? 'true' : 'false',
      isSaler: user.isSaler ? 'true' : 'false',
    };
    const accessToken = this._signPayload(jwtAccessPayload, ADMIN_ACCESS_TOKEN);
    return {
      accessToken,
    };
  }

  async changePassword(data: ChangePasswordDto) {
    const user = await this.userService.findOne(data.id);
    if (!user) throw new UnauthorizedException(AUTH_ERRORS.AUTH_01);
    const passwordHash = await this._hashPassword(data.password);
    return this.userService.updatePassword(user.id, passwordHash);
  }

  async forgotPassword(email: string) {
    const user = await this.userService.findByEmail(email);

    const resetCode = this.generalResetCode();
    await this.userService.saveResetCode(user.id, resetCode);
    try {
      await this.authQueueService.addSendEmailJob(email, resetCode);
      return {
        message: 'Email send success',
      };
    } catch (error) {
      console.log(error);
    }
  }

  async resetPassword(data: ResetPasswordDto) {
    const user = await this.userService.findResetCode(data.code);
    if (!user) throw new UnauthorizedException('Invalid reset code');
    const passwordHash = await this._hashPassword(data.password);
    const result = await this.userService.updatePassword(user.id, passwordHash);
    if (result) await this.userService.cleanResetCode(user.id);
    return result;
  }

  async adminGetStarted(data: GetStartedDto) {
    const user = await this.userService.findByEmail(data.email);
    if (!user || !user.isAdmin)
      throw new UnauthorizedException('User not found');
    return user;
  }

  async adminLogin(login: LoginDto) {
    const user = await this.userService.findByEmail(login.email);
    if (user.isAdmin) {
      const jwtAccessPayload: JwtAccessPayload = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isAdmin: user.isAdmin ? 'true' : 'false',
        isUser: user.isUser ? 'true' : 'false',
        isSaler: user.isSaler ? 'true' : 'false',
      };
      const jwtRefreshPayload: JwtRefreshPayload = {
        id: user.id,
      };
      const accessToken = this._signPayload(
        jwtAccessPayload,
        ADMIN_ACCESS_TOKEN,
      );
      const refreshToken = this._signPayload(
        jwtRefreshPayload,
        ADMIN_REFRESH_TOKEN,
      );
      return {
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    }
    throw new UnauthorizedException();
  }

  async getProfile(id: string) {
    const user = await this.userService.findOne(id);
    if (!user) throw new UnauthorizedException('User not found');
    return {
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
    };
  }

  /** ============================== Passport ============================== */
  // For local strategy
  async validateUser(email: string, password: string) {
    const user = await this.userService.findByEmail(email);
    if (!user) throw new UnauthorizedException(AUTH_ERRORS.AUTH_01);
    if (user.isAdmin) {
      if (user.adminStatus == 'Block' || user.deletedAt != null)
        throw new UnauthorizedException(AUTH_ERRORS.AUTH_02);
    }
    if (user.isUser) {
      if (user.userStatus == 'Block' || user.deletedAt != null)
        throw new UnauthorizedException(AUTH_ERRORS.AUTH_02);
    }
    if (user.isSaler) {
      if (user.salerStatus == 'Block' || user.deletedAt != null)
        throw new UnauthorizedException(AUTH_ERRORS.AUTH_02);
    }
    const chekPassword = await this._comparePasswords(password, user.password);
    if (chekPassword) {
      return user;
    }
    throw new UnauthorizedException(AUTH_ERRORS.AUTH_03);
  }

  //For Admin strategy
  async validateAdmin(payload: JwtAccessPayload) {
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new NotFoundException('Admin account not found');
    }
    if (!user.isAdmin || user.adminStatus === 'Block') {
      throw new UnauthorizedException();
    }
    return payload;
  }

  //For Saler strategy
  async validateSaler(payload: JwtAccessPayload) {
    const user = await this.userService.findOne(payload.id);
    if (!user) {
      throw new NotFoundException('Saler account not found');
    }
    if (!user.isSaler || user.salerStatus == 'Block') {
      throw new UnauthorizedException();
    }
    return payload;
  }
  /** ============================== Passport ============================== */

  /** ============================== General ============================== */
  // async generateTokens() {}

  private async _hashPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    return await bcrypt.hash(password, salt);
  }

  private async _comparePasswords(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
  }

  private _signPayload(
    payload: JwtAccessPayload | JwtRefreshPayload,
    type: TokenType,
  ) {
    return sign(payload, this._jwtKeys[type], this._jwtOptions[type]);
  }

  private _decodeToken(token: string): string | JwtPayload {
    return decode(token);
  }

  private generalResetCode() {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  /** ============================== General ============================== */
}
