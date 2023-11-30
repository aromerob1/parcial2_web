import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { FotoEntity } from './foto.entity/foto.entity';

@Injectable()
export class FotoService {
  constructor(
    @InjectRepository(FotoEntity)
    private readonly fotoRepository: Repository<FotoEntity>,
  ) {}

  async findAllFotos(): Promise<FotoEntity[]> {
    return await this.fotoRepository.find({
      relations: ['usuario', 'album'],
    });
  }

  async findFotoById(id: string): Promise<FotoEntity> {
    const foto: FotoEntity = await this.fotoRepository.findOne({
      where: { id },
      relations: ['usuario', 'album'],
    });
    if (!foto)
      throw new BusinessLogicException(
        'The foto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return foto;
  }

  async createFoto(foto: FotoEntity): Promise<FotoEntity> {

    if (foto.ISO < 100 || foto.ISO > 6400) {
      throw new BusinessLogicException(
        'El valor de ISO esta mal',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (foto.velObturacion < 2 || foto.velObturacion > 250) {
      throw new BusinessLogicException(
        'El valor de obturacion esta mal',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    if (foto.apertura < 1 || foto.apertura > 32) {
      throw new BusinessLogicException(
        'Apertura esta mal',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.fotoRepository.save(foto);
  }

  async deleteFoto(id: string) {
    const foto: FotoEntity = await this.fotoRepository.findOne({
      where: { id },
      relations: ['usuario', 'album'],
    });
    if (!foto)
      throw new BusinessLogicException(
        'The foto with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    await this.fotoRepository.remove(foto);
  }
}
