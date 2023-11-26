import { Injectable } from '@nestjs/common';
import { AlbumEntity } from './album.entity/album.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class AlbumService {
  constructor(
    @InjectRepository(AlbumEntity)
    private readonly albumRepository: Repository<AlbumEntity>,
  ) {}

  async findAll(): Promise<AlbumEntity[]> {
    return await this.albumRepository.find({
      relations: ['tracks', 'performers'],
    });
  }

  async findOne(id: string): Promise<AlbumEntity> {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The performer with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    return album;
  }

  async create(album: AlbumEntity): Promise<AlbumEntity> {

    if (album.nombre == null || album.descripcion == null) {
      throw new BusinessLogicException(
        'Name and description are required',
        BusinessError.PRECONDITION_FAILED,
      );
    }
    return await this.albumRepository.save(album);
  }

  async delete(id: string) {
    const album: AlbumEntity = await this.albumRepository.findOne({
      where: { id },
      relations: ['tracks', 'performers'],
    });
    if (!album)
      throw new BusinessLogicException(
        'The album with the given id was not found',
        BusinessError.NOT_FOUND,
      );

    if (album.tracks && album.tracks.length > 0)
      throw new BusinessLogicException(
        'An album with associated tracks cannot be deleted.',
        BusinessError.BAD_REQUEST,
      );

    await this.albumRepository.remove(album);
  }
}
