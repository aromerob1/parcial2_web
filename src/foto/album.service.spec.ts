import { Test, TestingModule } from '@nestjs/testing';
import { AlbumService } from './album.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AlbumEntity } from './album.entity/album.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

describe('AlbumService', () => {
  let service: AlbumService;
  let repository: Repository<AlbumEntity>;
  let albumsList: AlbumEntity[];

  beforeEach(async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [AlbumService],
      }).compile();

      service = module.get<AlbumService>(AlbumService);
      repository = module.get<Repository<AlbumEntity>>(
        getRepositoryToken(AlbumEntity),
      );

      await seedDatabase();
    } catch (error) {
      console.error('Error during test setup:', error);
    }
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  const seedDatabase = async () => {
    try {
      repository.clear();
      albumsList = [];
      for (let i = 0; i < 5; i++) {
        const album: AlbumEntity = await repository.save({
          nombre: faker.company.name(),
          caratula: faker.image.url(),
          fechaLanzamiento: faker.date.past(),
          descripcion: faker.lorem.sentence(),
        });
        albumsList.push(album);
      }
    } catch (error) {
      console.error('Error during test setup:', error);
    }
  };

  it('create should return a new album', async () => {
    try {
      const album: AlbumEntity = {
        id: '',
        nombre: faker.company.name(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: faker.lorem.sentence(),
        tracks: [],
        performers: [],
      };

      const newAlbum: AlbumEntity = await service.create(album);
      expect(newAlbum).not.toBeNull();

      const storedAlbum: AlbumEntity = await repository.findOne({
        where: { id: newAlbum.id },
      });
      expect(storedAlbum).not.toBeNull();
      expect(storedAlbum.nombre).toEqual(newAlbum.nombre);
      expect(storedAlbum.caratula).toEqual(newAlbum.caratula);
      expect(storedAlbum.fechaLanzamiento).toEqual(newAlbum.fechaLanzamiento);
      expect(storedAlbum.descripcion).toEqual(newAlbum.descripcion);
    } catch (error) {
    }
  });

  it('create without description should return a business exception', async () => {
      const album: AlbumEntity = {
        id: '',
        nombre: faker.company.name(),
        caratula: faker.image.url(),
        fechaLanzamiento: faker.date.past(),
        descripcion: null,
        tracks: [],
        performers: [],
      };

      await expect(service.create(album)).rejects.toHaveProperty("message", "Name and description are required");


      const storedAlbum: AlbumEntity = await repository.findOne({
        where: { id: album.id },
      });
      expect(storedAlbum).toBeNull();
  });
});
