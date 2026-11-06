import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AuthController } from './auth.controller';
import { AdminRoleGuard } from './guards/admin-role.guard';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        config.getOrThrow<string>('ADMIN_EMAIL');
        const passwordHash = config.getOrThrow<string>('ADMIN_PASSWORD_HASH');
        const [salt, digest] = passwordHash.split(':');
        if (
          !salt ||
          salt.length < 16 ||
          Buffer.from(digest ?? '', 'base64url').length !== 64
        ) {
          throw new Error(
            'ADMIN_PASSWORD_HASH debe tener el formato salt:hash con un hash scrypt de 64 bytes',
          );
        }

        const secret = config.getOrThrow<string>('JWT_SECRET');
        if (Buffer.byteLength(secret) < 32) {
          throw new Error('JWT_SECRET debe tener al menos 32 bytes');
        }
        return {
          secret,
          signOptions: { expiresIn: '1h' },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, JwtAuthGuard, AdminRoleGuard],
  exports: [AuthService, JwtAuthGuard, JwtModule],
})
export class AuthModule {}
