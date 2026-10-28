import {
  Controller,
  Get,
  Patch,
  Param,
  Body,
  ParseUUIDPipe,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { UpdateVerificationDto } from './dto/update-verification.dto';

@ApiTags('admin-verifications')
@Controller('admin/verifications')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  @ApiOperation({ summary: 'Consultar lanchas/operadores pendientes de verificación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operadores pendientes obtenida exitosamente.',
  })
  findPending() {
    return this.adminService.findPendingVerifications();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar el estado de verificación de un operador' })
  @ApiParam({
    name: 'id',
    description: 'UUID del operador de embarcación',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Estado de verificación actualizado exitosamente.',
  })
  @ApiResponse({ status: 400, description: 'Datos inválidos o estado incorrecto.' })
  @ApiResponse({ status: 404, description: 'Operador no encontrado.' })
  updateVerification(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateVerificationDto,
  ) {
    return this.adminService.updateVerification(id, dto);
  }
}