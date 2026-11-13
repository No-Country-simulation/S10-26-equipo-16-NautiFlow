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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
} from '@nestjs/swagger';

import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { AssignBoatDto } from './dto/assign-boat.dto';

@ApiTags('trips')
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @ApiOperation({ summary: 'Registrar un nuevo viaje' })
  @ApiResponse({
    status: 201,
    description: 'Viaje registrado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados son inválidos.',
  })
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los viajes' })
  @ApiResponse({
    status: 200,
    description: 'Lista de viajes obtenida exitosamente.',
  })
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un viaje por su ID' })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del viaje.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Viaje encontrado.',
  })
  @ApiResponse({
    status: 400,
    description: 'El identificador proporcionado no es válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el viaje solicitado.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un viaje' })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del viaje.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Viaje actualizado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID o los datos enviados son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el viaje solicitado.',
  })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Patch(':id/assign-boat')
  @ApiOperation({
    summary: 'Asignar manualmente una lancha a un viaje',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del viaje.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiBody({ type: AssignBoatDto })
  @ApiResponse({
    status: 200,
    description: 'Lancha asignada al viaje exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID o los datos de asignación son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el viaje o la lancha.',
  })
  assignBoat(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: AssignBoatDto,
  ) {
    return this.tripsService.assignBoat(id, dto.boatId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un viaje' })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID del viaje.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Viaje eliminado exitosamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El identificador proporcionado no es válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró el viaje solicitado.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.tripsService.remove(id);
  }
}
