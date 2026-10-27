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

import { BoatOperatorsService } from './boat-operators.service';
import { CreateBoatOperatorDto } from './dto/create-boat-operator.dto';
import { UpdateBoatOperatorDto } from './dto/update-boat-operator.dto';
import { CreateBoatDto } from './dto/create-boat.dto';

@ApiTags('boat-operators')
@Controller('boat-operators')
export class BoatOperatorsController {
  constructor(private readonly boatOperatorsService: BoatOperatorsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo operador de embarcación' })
  @ApiResponse({
    status: 201,
    description: 'Operador de embarcación registrado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados son inválidos.',
  })
  create(@Body() createBoatOperatorDto: CreateBoatOperatorDto) {
    return this.boatOperatorsService.create(createBoatOperatorDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los operadores de embarcación' })
  @ApiResponse({
    status: 200,
    description: 'Lista de operadores de embarcación obtenida exitosamente.',
  })
  findAll() {
    return this.boatOperatorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un operador de embarcación por su ID' })
  @ApiParam({
    name: 'id',
    description: 'UUID del operador de embarcación',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Operador de embarcación encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID proporcionado no es un UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el operador de embarcación.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boatOperatorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un operador de embarcación' })
  @ApiParam({
    name: 'id',
    description: 'UUID del operador de embarcación',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Operador de embarcación actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID o los datos enviados son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el operador de embarcación.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateBoatOperatorDto: UpdateBoatOperatorDto,
  ) {
    return this.boatOperatorsService.update(id, updateBoatOperatorDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un operador de embarcación' })
  @ApiParam({
    name: 'id',
    description: 'UUID del operador de embarcación',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 200,
    description: 'Operador de embarcación eliminado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID proporcionado no es un UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el operador de embarcación.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.boatOperatorsService.remove(id);
  }

  @Post(':boatOperatorId/boats')
  @ApiOperation({
    summary: 'Registrar una embarcación para un operador',
  })
  @ApiParam({
    name: 'boatOperatorId',
    description: 'UUID del operador propietario',
    type: String,
    format: 'uuid',
  })
  @ApiResponse({
    status: 201,
    description: 'Embarcación registrada exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description:
      'El ID del operador o los datos de la embarcación son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'El operador de embarcación no existe.',
  })
  createBoat(
    @Param('boatOperatorId', ParseUUIDPipe) boatOperatorId: string,
    @Body() createBoatDto: CreateBoatDto,
  ) {
    return this.boatOperatorsService.createBoat(boatOperatorId, createBoatDto);
  }
}
