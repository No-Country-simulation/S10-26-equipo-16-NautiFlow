import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {
      status: 'ok',
      message: 'NautiFlow API funcionando correctamente',
      timestamp: new Date().toISOString(),
    };
  }
}
