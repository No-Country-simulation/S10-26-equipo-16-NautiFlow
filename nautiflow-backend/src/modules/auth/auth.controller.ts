import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UsePipes,
  ValidationPipe,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiProperty,
  ApiTags,
} from '@nestjs/swagger';
import { IsEmail, IsString, MinLength } from 'class-validator';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AdminRoleGuard } from './guards/admin-role.guard';

type AuthenticatedRequest = {
  user: { userId: string; email: string; role: string };
};

class LoginDto {
  @ApiProperty({ example: 'admin@nautiflow.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ minLength: 8, example: 'Una contraseña segura' })
  @IsString()
  @MinLength(8)
  password: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @UsePipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }))
  @ApiOperation({ summary: 'Iniciar sesión como administrador' })
  async login(@Body() body: LoginDto) {
    return this.authService.login(body.email, body.password);
  }

  @Get('session')
  @UseGuards(JwtAuthGuard, AdminRoleGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Validar la sesión del administrador' })
  getSession(@Req() request: AuthenticatedRequest) {
    return request.user;
  }
}
