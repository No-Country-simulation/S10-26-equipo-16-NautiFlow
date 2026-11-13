import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from './app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('health')
  @ApiOperation({ summary: 'Verificar el estado de la API' })
  @ApiResponse({
    status: 200,
    description: 'La API está funcionando correctamente.',
    schema: {
      example: {
        status: 'ok',
        message: 'NautiFlow API funcionando correctamente',
        timestamp: '2026-10-27T19:00:00.000Z',
      },
    },
  })
  getHealth() {
    return this.appService.getHealth();
  }
}
