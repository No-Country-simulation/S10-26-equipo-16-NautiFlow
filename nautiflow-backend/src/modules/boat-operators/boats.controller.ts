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
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { BoatOperatorsService } from './boat-operators.service';
import { CreateBoatDto } from './dto/create-boat.dto';
import { UpdateBoatDto } from './dto/update-boat.dto';

@ApiTags('boats')
@Controller('boat-operators')
export class BoatsController {
  constructor(private readonly boatOperatorsService: BoatOperatorsService) {}

  @Post(':operatorId/boats')
  @ApiOperation({ summary: 'Registrar una embarcación para un operador' })
  create(
    @Param('operatorId', ParseUUIDPipe) operatorId: string,
    @Body() dto: CreateBoatDto,
  ) {
    return this.boatOperatorsService.createBoat(operatorId, dto);
  }

  @Get(':operatorId/boats')
  @ApiOperation({ summary: 'Listar las embarcaciones de un operador' })
  findByOperator(@Param('operatorId', ParseUUIDPipe) operatorId: string) {
    return this.boatOperatorsService.findBoatsByOperator(operatorId);
  }

  @Get('boats/:boatId')
  @ApiOperation({ summary: 'Obtener una embarcación' })
  findOne(@Param('boatId', ParseUUIDPipe) boatId: string) {
    return this.boatOperatorsService.findBoat(boatId);
  }

  @Patch('boats/:boatId')
  @ApiOperation({ summary: 'Actualizar una embarcación' })
  update(
    @Param('boatId', ParseUUIDPipe) boatId: string,
    @Body() dto: UpdateBoatDto,
  ) {
    return this.boatOperatorsService.updateBoat(boatId, dto);
  }

  @Delete('boats/:boatId')
  @ApiOperation({ summary: 'Eliminar una embarcación' })
  remove(@Param('boatId', ParseUUIDPipe) boatId: string) {
    return this.boatOperatorsService.removeBoat(boatId);
  }
}
