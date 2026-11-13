import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiBody,
  ApiConsumes,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import 'multer';
import { documentUploadOptions } from './multer.config';
import { CreateStorageDto } from './dto/create-storage.dto';
import { StorageService } from './storage.service';

@ApiTags('storage')
@Controller('storage')
export class StorageController {
  constructor(private readonly storageService: StorageService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file', documentUploadOptions()))
  @ApiOperation({ summary: 'Subir un archivo a Cloudinary' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: { type: 'string', format: 'binary' },
        entityType: { type: 'string', example: 'boat-operator' },
        entityId: { type: 'string', format: 'uuid' },
        fileType: { type: 'string', example: 'profile-photo' },
      },
      required: ['file', 'entityType', 'entityId', 'fileType'],
    },
  })
  @ApiResponse({ status: 201, description: 'Archivo subido y registrado.' })
  upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() dto: CreateStorageDto,
  ) {
    return this.storageService.upload(file, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un archivo de Cloudinary y PostgreSQL' })
  @ApiParam({ name: 'id', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Archivo eliminado.' })
  @ApiResponse({ status: 404, description: 'Archivo no encontrado.' })
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.storageService.remove(id);
  }
}
