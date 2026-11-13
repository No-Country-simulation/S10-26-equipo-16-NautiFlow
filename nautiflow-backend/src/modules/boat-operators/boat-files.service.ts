import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Boat } from './entities/boat.entity';
import { BoatOperator } from './entities/boat-operator.entity';
import { StorageService } from '../storage/storage.service';

@Injectable()
export class BoatFilesService {
  constructor(
    @InjectRepository(BoatOperator)
    private readonly operatorRepository: Repository<BoatOperator>,
    @InjectRepository(Boat)
    private readonly boatRepository: Repository<Boat>,
    private readonly storageService: StorageService,
  ) {}

  async uploadProfilePhoto(operatorId: string, file: Express.Multer.File) {
    const operator = await this.findOperator(operatorId);
    const previousPublicId = operator.fotoPerfilPublicId;
    const storedFile = await this.storageService.upload(file, {
      entityType: 'boat-operator',
      entityId: operatorId,
      fileType: 'profile-photo',
    });

    operator.fotoPerfilUrl = storedFile.url;
    operator.fotoPerfilPublicId = storedFile.publicId;

    let saved: BoatOperator;
    try {
      saved = await this.operatorRepository.save(operator);
    } catch (error) {
      await this.storageService.remove(storedFile.id);
      throw error;
    }

    if (previousPublicId) {
      await this.storageService.removeByPublicId(previousPublicId);
    }
    return saved;
  }

  async uploadOperatorDocument(
    operatorId: string,
    document: 'licencia' | 'antecedentes-penales',
    file: Express.Multer.File,
  ) {
    const operator = await this.findOperator(operatorId);
    const previousPublicId =
      document === 'licencia'
        ? operator.licenciaPublicId
        : operator.antecedentesPenalesPublicId;
    const storedFile = await this.storageService.upload(file, {
      entityType: 'boat-operator',
      entityId: operatorId,
      fileType: document,
    });

    if (document === 'licencia') {
      operator.licenciaUrl = storedFile.url;
      operator.licenciaPublicId = storedFile.publicId;
    } else {
      operator.antecedentesPenalesUrl = storedFile.url;
      operator.antecedentesPenalesPublicId = storedFile.publicId;
    }

    let saved: BoatOperator;
    try {
      saved = await this.operatorRepository.save(operator);
    } catch (error) {
      await this.storageService.remove(storedFile.id);
      throw error;
    }

    if (previousPublicId) {
      await this.storageService.removeByPublicId(previousPublicId);
    }
    return saved;
  }

  async addBoatPhoto(boatId: string, file: Express.Multer.File) {
    const boat = await this.boatRepository.findOneBy({ id: boatId });
    if (!boat) {
      throw new NotFoundException(`Embarcación con ID ${boatId} no encontrada`);
    }

    const storedFile = await this.storageService.upload(file, {
      entityType: 'boat',
      entityId: boatId,
      fileType: 'boat-photo',
    });
    boat.fotos = [
      ...(boat.fotos ?? []),
      { url: storedFile.url, publicId: storedFile.publicId },
    ];

    try {
      return await this.boatRepository.save(boat);
    } catch (error) {
      await this.storageService.remove(storedFile.id);
      throw error;
    }
  }

  async uploadBoatInsurance(boatId: string, file: Express.Multer.File) {
    const boat = await this.boatRepository.findOneBy({ id: boatId });
    if (!boat) {
      throw new NotFoundException(`Embarcación con ID ${boatId} no encontrada`);
    }

    const previousPublicId = boat.seguroPublicId;
    const storedFile = await this.storageService.upload(file, {
      entityType: 'boat',
      entityId: boatId,
      fileType: 'insurance',
    });
    boat.seguroUrl = storedFile.url;
    boat.seguroPublicId = storedFile.publicId;

    let saved: Boat;
    try {
      saved = await this.boatRepository.save(boat);
    } catch (error) {
      await this.storageService.remove(storedFile.id);
      throw error;
    }

    if (previousPublicId) {
      await this.storageService.removeByPublicId(previousPublicId);
    }
    return saved;
  }

  private async findOperator(id: string): Promise<BoatOperator> {
    const operator = await this.operatorRepository.findOneBy({ id });
    if (!operator) {
      throw new NotFoundException(`Operador con ID ${id} no encontrado`);
    }
    return operator;
  }
}
