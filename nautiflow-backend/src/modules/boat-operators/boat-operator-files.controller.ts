import {
  BadRequestException,
  Controller,
  Param,
  ParseFilePipe,
  ParseUUIDPipe,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import 'multer';
import {
  documentUploadOptions,
  imageUploadOptions,
} from '../storage/multer.config';
import { BoatFilesService } from './boat-files.service';

@ApiTags('boat-operator-files')
@Controller('boat-operator-files')
export class BoatOperatorFilesController {
  constructor(private readonly boatFilesService: BoatFilesService) {}

  @Post('operators/:operatorId/profile-photo')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  @ApiOperation({
    summary: 'Subir o reemplazar la foto de perfil del operador',
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  uploadProfilePhoto(
    @Param('operatorId', ParseUUIDPipe) operatorId: string,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.boatFilesService.uploadProfilePhoto(operatorId, file);
  }

  @Post('operators/:operatorId/documents/:documentType')
  @UseInterceptors(FileInterceptor('file', documentUploadOptions()))
  @ApiOperation({ summary: 'Subir o reemplazar licencia o antecedentes' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  uploadOperatorDocument(
    @Param('operatorId', ParseUUIDPipe) operatorId: string,
    @Param('documentType') documentType: string,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    if (
      documentType !== 'licencia' &&
      documentType !== 'antecedentes-penales'
    ) {
      throw new BadRequestException(
        'documentType debe ser licencia o antecedentes-penales',
      );
    }
    return this.boatFilesService.uploadOperatorDocument(
      operatorId,
      documentType,
      file,
    );
  }

  @Post('boats/:boatId/photos')
  @UseInterceptors(FileInterceptor('file', imageUploadOptions()))
  @ApiOperation({ summary: 'Agregar una fotografía a una embarcación' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  addBoatPhoto(
    @Param('boatId', ParseUUIDPipe) boatId: string,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.boatFilesService.addBoatPhoto(boatId, file);
  }

  @Post('boats/:boatId/insurance')
  @UseInterceptors(FileInterceptor('file', documentUploadOptions()))
  @ApiOperation({ summary: 'Subir o reemplazar el seguro de una embarcación' })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: { file: { type: 'string', format: 'binary' } },
      required: ['file'],
    },
  })
  uploadBoatInsurance(
    @Param('boatId', ParseUUIDPipe) boatId: string,
    @UploadedFile(new ParseFilePipe({ fileIsRequired: true }))
    file: Express.Multer.File,
  ) {
    return this.boatFilesService.uploadBoatInsurance(boatId, file);
  }
}
