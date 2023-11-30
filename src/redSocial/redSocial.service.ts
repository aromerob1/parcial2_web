import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { RedSocialEntity } from './redSocial.entity/redSocial.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RedSocialService {
    constructor(
        @InjectRepository(RedSocialEntity)
        private readonly redSocialRepository: Repository<RedSocialEntity>
    ){}

    async createRedSocial(redSocial: RedSocialEntity): Promise<RedSocialEntity> {
        if (redSocial.slogan.length <= 0) {
            throw new BadRequestException('El slogan no puede estar vacio.');
        }

        if (redSocial.slogan.length < 20) {
            throw new BadRequestException('El slogan debe tener por lo menos 20 caracteres.');
        }
        
        return await this.redSocialRepository.save(redSocial);
    }
}
