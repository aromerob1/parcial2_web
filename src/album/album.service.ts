import { Injectable } from '@nestjs/common';
import { AlbumEntity } from './album.entity/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { FotoEntity } from '../foto/foto.entity/foto.entity';

@Injectable()
export class AlbumService {
    constructor(
        @InjectRepository(AlbumEntity)
        private readonly albumRepository: Repository<AlbumEntity>,
        @InjectRepository(FotoEntity)
        private readonly fotoRepository: Repository<FotoEntity> 
    ){}

    async findAlbumById(id: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id}, relations: ["fotos"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
   
        return album;
    }

    async createAlbum(album: AlbumEntity): Promise<AlbumEntity> {
        if (album.titulo.length <= 0) {
            throw new BusinessLogicException('El titulo no puede ser vacio', BusinessError.NOT_FOUND);
        }
        return await this.albumRepository.save(album);
    }

    async addPhotoToAlbum(idAlbum: string, idFoto: string): Promise<AlbumEntity> {
        const album: AlbumEntity = await this.albumRepository.findOne({where: {id: idAlbum}, relations: ["fotos"] } );
        if (!album)
          throw new BusinessLogicException("The album with the given id was not found", BusinessError.NOT_FOUND);
        const foto: FotoEntity = await this.fotoRepository.findOne({where: {id: idFoto}, relations: ["album"] } );
        if (!foto)
          throw new BusinessLogicException("The foto with the given id was not found", BusinessError.NOT_FOUND);

        if (foto.fecha < album.fechaInicio || foto.fecha > album.fechaFin) {
            throw new BusinessLogicException('La foto no esta en el rango de fechas del album', BusinessError.NOT_FOUND);
        }
        
        album.fotos = [...album.fotos, foto];
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
