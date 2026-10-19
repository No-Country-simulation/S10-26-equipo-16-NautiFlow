import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { LancherosService } from './lancheros.service';
import { CreateLancheroDto } from './dto/create-lanchero.dto';
import { UpdateLancheroDto } from './dto/update-lanchero.dto';

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
  @ApiOperation({ summary: 'Obtener la lista de todos los lancheros' })
  findAll() {
    return this.lancherosService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un lanchero por su ID' })
  findOne(@Param('id') id: string) {
    return this.lancherosService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un lanchero' })
  update(
    @Param('id') id: string,
    @Body() updateLancheroDto: UpdateLancheroDto,
  ) {
    return this.lancherosService.update(id, updateLancheroDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un lanchero' })
  remove(@Param('id') id: string) {
    return this.lancherosService.remove(id);
  }
}