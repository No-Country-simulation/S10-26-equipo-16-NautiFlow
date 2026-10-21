import {
  Body,
  Controller,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { EmptyLegsService } from './empty-legs.service';
import { CreateEmptyLegDto } from './dto/create-empty-leg.dto';
import { UpdateEmptyLegDto } from './dto/update-empty-leg.dto';

@ApiTags('empty-legs')
@Controller('empty-legs')
export class EmptyLegsController {
  constructor(private readonly emptyLegsService: EmptyLegsService) {}

  @Post()
  @ApiOperation({ summary: 'Crear un nuevo empty leg' })
  @ApiResponse({
    status: 201,
    description: 'El empty leg ha sido creado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Solicitud incorrecta o datos inválidos.',
  })
  create(@Body() createEmptyLegDto: CreateEmptyLegDto) {
    return this.emptyLegsService.create(createEmptyLegDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los empty legs' })
  @ApiResponse({
    status: 200,
    description: 'Lista de empty legs obtenida exitosamente.',
  })
  findAll() {
    return this.emptyLegsService.findAll();
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un empty leg existente' })
  @ApiParam({
    name: 'id',
    description: 'UUID del empty leg a actualizar',
    type: 'string',
  })
  @ApiResponse({
    status: 200,
    description: 'El empty leg ha sido actualizado exitosamente.',
  })
  @ApiResponse({ status: 404, description: 'Empty leg no encontrado.' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateEmptyLegDto: UpdateEmptyLegDto,
  ) {
    return this.emptyLegsService.update(id, updateEmptyLegDto);
  }
}
