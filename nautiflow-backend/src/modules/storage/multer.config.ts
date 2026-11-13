import { BadRequestException } from '@nestjs/common';
import { memoryStorage } from 'multer';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

const MAX_FILE_SIZE = 10 * 1024 * 1024;

const IMAGE_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const DOCUMENT_MIME_TYPES = [...IMAGE_MIME_TYPES, 'application/pdf'];

function createMulterOptions(
  allowedMimeTypes: string[],
  validationMessage: string,
): MulterOptions {
  return {
    storage: memoryStorage(),
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: (_request, file, callback) => {
      if (!allowedMimeTypes.includes(file.mimetype)) {
        callback(new BadRequestException(validationMessage), false);
        return;
      }
      callback(null, true);
    },
  };
}

export const imageUploadOptions = (): MulterOptions =>
  createMulterOptions(
    IMAGE_MIME_TYPES,
    'Solo se aceptan imágenes JPG, PNG o WEBP',
  );

export const documentUploadOptions = (): MulterOptions =>
  createMulterOptions(
    DOCUMENT_MIME_TYPES,
    'Solo se aceptan PDF, JPG, PNG o WEBP',
  );
