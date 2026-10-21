import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseUUIDPipe,
} from '@nestjs/common';

import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';

import { LancherosService } from './lancheros.service';
import { CreateLancheroDto } from './dto/create-lanchero.dto';
import { UpdateLancheroDto } from './dto/update-lanchero.dto';
import { CreateBoatDto } from './dto/create-boat.dto';

@ApiTags('lancheros')
@Controller('lancheros')
export class LancherosController {
  constructor(private readonly lancherosService: LancherosService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo lanchero' })
  @ApiResponse({
    status: 201,
    description: 'Lanchero registrado exitosamente.',
  })
  create(@Body() createLancheroDto: CreateLancheroDto) {
    return this.lancherosService.create(createLancheroDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los lancheros' })
  findAll() {
    return this.lancherosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lanchero por su ID' })
  @ApiParam({ name: 'id', description: 'UUID del lanchero' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.lancherosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un lanchero' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateLancheroDto: UpdateLancheroDto,
  ) {
    return this.lancherosService.update(id, updateLancheroDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lanchero' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.lancherosService.remove(id);
  }

  @Post(':lancheroId/boats')
  @ApiOperation({
    summary: 'Registrar una embarcación para un lanchero',
  })
  @ApiParam({
    name: 'lancheroId',
    description: 'UUID del lanchero propietario',
  })
  @ApiResponse({
    status: 201,
    description: 'Embarcación registrada exitosamente.',
  })
  @ApiResponse({
    status: 404,
    description: 'El lanchero no existe.',
  })
  createBoat(
    @Param('lancheroId', ParseUUIDPipe) lancheroId: string,
    @Body() createBoatDto: CreateBoatDto,
  ) {
    return this.lancherosService.createBoat(lancheroId, createBoatDto);
  }
}
