import { Injectable } from '@nestjs/common';
import { AlbumEntity } from './album.entity/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from 'src/shared/errors/business-errors';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>
    ){}

    async findAlbumById(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["fotos"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
        return album;
    }

    async createAlbum(album: AlbumEntity): Promise<AlbumEntity> {
        if (album.titulo.length <= 0) {
            throw new BusinessLogicException('El telefono debe tener exactamente 10 caracteres', BusinessError.NOT_FOUND);
        }
        return await this.albumRepository.save(album);
    }

    async deleteAlbum(id: string) {
        const album: AlbumEntity = await this.albumRepository.findOne({
          where: { id },
          relations: ['fotos'],
        });
        if (!album)
          throw new BusinessLogicException(
            'The album with the given id was not found',
            BusinessError.NOT_FOUND,
          );
    
        if (album.fotos && album.fotos.length > 0)
          throw new BusinessLogicException(
            'An album with associated fotos cannot be deleted.',
            BusinessError.BAD_REQUEST,
          );
    
        await this.albumRepository.remove(album);
      }
}
