import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { scryptSync, timingSafeEqual } from 'node:crypto';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async login(email: string, password: string) {
    const configuredEmail = this.configService
      .getOrThrow<string>('ADMIN_EMAIL')
      .trim()
      .toLowerCase();
    const passwordHash = this.configService.getOrThrow<string>(
      'ADMIN_PASSWORD_HASH',
    );
    const [salt, expectedHash] = passwordHash.split(':');

    if (!salt || !expectedHash) {
      throw new Error('ADMIN_PASSWORD_HASH debe tener el formato salt:hash');
    }

    const expected = Buffer.from(expectedHash, 'base64url');
    const actual = scryptSync(password, salt, 64);
    const emailMatches = email.trim().toLowerCase() === configuredEmail;
    const passwordMatches =
      expected.length === actual.length && timingSafeEqual(expected, actual);

    if (!emailMatches || !passwordMatches) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    return {
      access_token: this.jwtService.sign({
        email: configuredEmail,
        sub: 'admin',
        role: 'admin',
      }),
    };
  }
}
