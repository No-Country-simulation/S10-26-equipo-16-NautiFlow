import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { ApiProperty } from '@nestjs/swagger';

class LoginDto {
  @ApiProperty({ example: 'admin@nautiflow.com', description: 'Correo electrónico' })
  email: string;

  @ApiProperty({ example: 'admin', description: 'Rol de usuario' })
  role: string;
}

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'Generar token JWT temporal para pruebas de admin' })
  async login(@Body() body: LoginDto) {
    return this.authService.login({
      id: '1-uuid-de-prueba',
      email: body.email || 'admin@nautiflow.com',
      role: body.role || 'admin',
    });
  }
}
