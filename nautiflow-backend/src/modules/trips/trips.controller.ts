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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';

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
  create(@Body() createTripDto: CreateTripDto) {
    return this.tripsService.create(createTripDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener la lista de todos los viajes' })
  findAll() {
    return this.tripsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un viaje por su ID' })
  findOne(@Param('id') id: string) {
    return this.tripsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar los datos de un viaje' })
  update(
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(id, updateTripDto);
  }

  @Patch(':id/assign-boat')
  @ApiOperation({ summary: 'Asignar manualmente una lancha a un viaje' })
  @ApiResponse({
    status: 200,
    description: 'Lancha asignada exitosamente al viaje.',
  })
  assignBoat(
    @Param('id') id: string,
    @Body('boatId') boatId: string,
  ) {
    return this.tripsService.assignBoat(id, boatId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un viaje' })
  remove(@Param('id') id: string) {
    return this.tripsService.remove(id);
  }
}