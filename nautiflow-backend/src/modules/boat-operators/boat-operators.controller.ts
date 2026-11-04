import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BoatOperatorsService } from './boat-operators.service';
import { CreateBoatOperatorDto } from './dto/create-boat-operator.dto';
import { UpdateBoatOperatorDto } from './dto/update-boat-operator.dto';

@ApiTags('boat-operators')
@Controller('boat-operators')
export class BoatOperatorsController {
  constructor(private readonly boatOperatorsService: BoatOperatorsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un operador de embarcación' })
  @ApiResponse({ status: 201, description: 'Operador registrado.' })
  create(@Body() dto: CreateBoatOperatorDto) {
    return this.boatOperatorsService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Listar operadores' })
  findAll() {
    return this.boatOperatorsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un operador' })
  @ApiParam({ name: 'id', format: 'uuid' })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.boatOperatorsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar un operador' })
  @ApiParam({ name: 'id', format: 'uuid' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateBoatOperatorDto,
  ) {
    return this.boatOperatorsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un operador' })
  @ApiParam({ name: 'id', format: 'uuid' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.boatOperatorsService.remove(id);
  }
}
