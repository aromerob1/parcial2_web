import { BadRequestException, Injectable } from '@nestjs/common';
import { PerformerEntity } from './usuario.entity/usuario.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PerformerService {
    constructor(
        @InjectRepository(PerformerEntity)
        private readonly performerRepository: Repository<PerformerEntity>
    ){}

    async findAll(): Promise<PerformerEntity[]> {
        return await this.performerRepository.find({ relations: ["albums"] });
    }

    async findOne(id: string): Promise<PerformerEntity> {
        const performer: PerformerEntity = await this.performerRepository.findOne({where: {id}, relations: ["albums"] } );
        if (!performer)
          throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
   
        return performer;
    }

    async create(performer: PerformerEntity): Promise<PerformerEntity> {
        if (performer.descripcion && performer.descripcion.length > 100) {
            throw new BadRequestException('La descripción no debe exceder los 100 caracteres.');
        }
        return await this.performerRepository.save(performer);
    }
}

