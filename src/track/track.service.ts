import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { TrackEntity } from './track.entity/track.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class TrackService {
    albumRepository: any;
    constructor(
        @InjectRepository(TrackEntity)
        private readonly trackRepository: Repository<TrackEntity>
    ){}

    async findAll(): Promise<TrackEntity[]> {
        return await this.trackRepository.find({ relations: ["album"] });
    }

    async findOne(id: string): Promise<TrackEntity> {
        const track: TrackEntity = await this.trackRepository.findOne({where: {id}, relations: ["album"] } );
        if (!track)
          throw new BusinessLogicException("The performer with the given id was not found", BusinessError.NOT_FOUND);
   
        return track;
    }

    async create(track: TrackEntity): Promise<TrackEntity> {
        if (track.duracion <= 0) {
            throw new BadRequestException('La duración del track debe ser un número positivo.');
        }

        if (track.album) {
            const album = await this.albumRepository.findOne(track.album.id);
            if (!album) {
                throw new NotFoundException('El álbum asociado no existe.');
            }
        } else {
            throw new BadRequestException('Debe asociar el track a un álbum.');
        }
        
        return await this.trackRepository.save(track);
    }
}
