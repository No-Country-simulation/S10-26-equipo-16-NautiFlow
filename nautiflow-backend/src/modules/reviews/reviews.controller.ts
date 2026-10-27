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

import { CreateReviewDto } from './dto/create-review.dto';
import { IssueReviewTokenDto } from './dto/issue-review-token.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewsService } from './reviews.service';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post('tokens')
  @ApiOperation({
    summary: 'Generar token para registrar una reseña',
    description:
      'Emite un token asociado a un viaje para autorizar el registro de una reseña.',
  })
  @ApiResponse({
    status: 201,
    description: 'Token generado correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'Los datos enviados son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'El viaje no existe.',
  })
  issueToken(@Body() dto: IssueReviewTokenDto) {
    return this.reviewsService.issueToken(dto.tripId);
  }

  @Post()
  @ApiOperation({
    summary: 'Crear una reseña',
    description:
      'Registra la calificación y el comentario de un turista sobre un viaje.',
  })
  @ApiResponse({
    status: 201,
    description: 'Reseña creada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'La calificación o los datos enviados son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'El viaje asociado no existe.',
  })
  @ApiResponse({
    status: 409,
    description: 'La reseña ya existe o existe un conflicto con el registro.',
  })
  create(@Body() dto: CreateReviewDto) {
    return this.reviewsService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Listar reseñas',
    description: 'Obtiene la lista de reseñas registradas.',
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de reseñas obtenida correctamente.',
  })
  findAll() {
    return this.reviewsService.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Consultar una reseña por ID',
    description: 'Obtiene una reseña mediante su identificador UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la reseña.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseña encontrada.',
  })
  @ApiResponse({
    status: 400,
    description: 'El identificador no tiene un formato UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la reseña.',
  })
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Actualizar una reseña',
    description: 'Actualiza los campos permitidos de una reseña existente.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la reseña.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseña actualizada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El ID o los datos enviados son inválidos.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la reseña.',
  })
  update(@Param('id', ParseUUIDPipe) id: string, @Body() dto: UpdateReviewDto) {
    return this.reviewsService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Eliminar una reseña',
    description: 'Elimina una reseña mediante su identificador UUID.',
  })
  @ApiParam({
    name: 'id',
    description: 'Identificador UUID de la reseña.',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @ApiResponse({
    status: 200,
    description: 'Reseña eliminada correctamente.',
  })
  @ApiResponse({
    status: 400,
    description: 'El identificador no tiene un formato UUID válido.',
  })
  @ApiResponse({
    status: 404,
    description: 'No se encontró la reseña.',
  })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.reviewsService.remove(id);
  }
}
