import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BoatOperator, VerificationStatus } from '../boat-operators/entities/boat-operator.entity';
import { UpdateVerificationDto } from './dto/update-verification.dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(BoatOperator)
    private readonly boatOperatorRepository: Repository<BoatOperator>,
  ) {}

  async findPendingVerifications(): Promise<BoatOperator[]> {
    return this.boatOperatorRepository.find({
      where: { estadoVerificacion: VerificationStatus.PENDING },
      relations: { boats: true },
      order: { createdAt: 'ASC' },
    });
  }

  async updateVerification(
    id: string,
    dto: UpdateVerificationDto,
  ): Promise<BoatOperator> {
    const operator = await this.boatOperatorRepository.findOne({
      where: { id },
      relations: { boats: true },
    });

    if (!operator) {
      throw new NotFoundException(`Operador de embarcación con ID ${id} no encontrado.`);
    }

    operator.estadoVerificacion = dto.estadoVerificacion;

    return this.boatOperatorRepository.save(operator);
  }
}