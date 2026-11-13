import {
  BadRequestException,
  Injectable,
  ServiceUnavailableException,
  NotFoundException,
} from '@nestjs/common';

import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

import { Storage } from './entities/storage.entity';
import { CreateStorageDto } from './dto/create-storage.dto';

@Injectable()
export class StorageService {
  constructor(
    private readonly configService: ConfigService,

    @InjectRepository(Storage)
    private readonly storageRepository: Repository<Storage>,
  ) {
    cloudinary.config({
      cloud_name: configService.get<string>('CLOUDINARY_CLOUD_NAME'),
      api_key: configService.get<string>('CLOUDINARY_API_KEY'),
      api_secret: configService.get<string>('CLOUDINARY_API_SECRET'),
      secure: true,
    });
  }

  async upload(
    file: Express.Multer.File,
    dto: CreateStorageDto,
  ): Promise<Storage> {
    if (!file?.buffer?.length) {
      throw new BadRequestException('Debes enviar un archivo válido');
    }

    this.ensureConfigured();

    const result = await new Promise<
      Pick<UploadApiResponse, 'secure_url' | 'public_id' | 'resource_type'>
    >((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: `nautiflow/${dto.entityType}/${dto.entityId}`,
          resource_type: 'auto',
        },
        (error, result) => {
          if (error || !result) {
            reject(
              new ServiceUnavailableException(
                'No fue posible subir el archivo a Cloudinary',
              ),
            );
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            resource_type: result.resource_type,
          });
        },
      );

      stream.end(file.buffer);
    });

    const storage = this.storageRepository.create({
      entityType: dto.entityType,
      entityId: dto.entityId,
      fileType: dto.fileType,
      url: result.secure_url,
      publicId: result.public_id,
      resourceType: result.resource_type,
    });

    try {
      return await this.storageRepository.save(storage);
    } catch (error) {
      // Evitar dejar archivos huérfanos en Cloudinary.
      await cloudinary.uploader.destroy(result.public_id, {
        resource_type: result.resource_type as 'image' | 'video' | 'raw',
      });

      throw error;
    }
  }

  async remove(id: string) {
    const storage = await this.storageRepository.findOne({
      where: { id },
    });

    if (!storage) {
      throw new NotFoundException('No se encontró el archivo');
    }

    this.ensureConfigured();

    try {
      const result = await cloudinary.uploader.destroy(storage.publicId, {
        resource_type: storage.resourceType as 'image' | 'video' | 'raw',
      });

      if (result.result !== 'ok' && result.result !== 'not found') {
        throw new Error('Cloudinary no confirmó la eliminación');
      }

      await this.storageRepository.remove(storage);

      return {
        message: 'Archivo eliminado exitosamente',
      };
    } catch {
      throw new ServiceUnavailableException(
        'No fue posible eliminar el archivo',
      );
    }
  }

  async removeByPublicId(publicId: string): Promise<void> {
    const storage = await this.storageRepository.findOneBy({ publicId });
    if (storage) {
      await this.remove(storage.id);
    }
  }

  private ensureConfigured(): void {
    const configured =
      this.configService.get<string>('CLOUDINARY_CLOUD_NAME') &&
      this.configService.get<string>('CLOUDINARY_API_KEY') &&
      this.configService.get<string>('CLOUDINARY_API_SECRET');

    if (!configured) {
      throw new ServiceUnavailableException('Cloudinary no está configurado');
    }
  }
}
