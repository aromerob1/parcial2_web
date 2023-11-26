import { Test, TestingModule } from '@nestjs/testing';
import { PerformerAlbumService } from './performer-album.service';
import { AlbumEntity } from '../album/album.entity/album.entity';
import { PerformerEntity } from '../performer/performer.entity/performer.entity'
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PerformerAlbumService', () => {
  let service: PerformerAlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let performerRepository: Repository<PerformerEntity>;
  let album: AlbumEntity;
  let performersList: PerformerEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PerformerAlbumService],
    }).compile();

    service = module.get<PerformerAlbumService>(PerformerAlbumService);
    albumRepository = module.get<Repository<AlbumEntity>>(
      getRepositoryToken(AlbumEntity),
    );
    performerRepository = module.get<Repository<PerformerEntity>>(
      getRepositoryToken(PerformerEntity),
    );

    await seedDatabase();
  });

  const seedDatabase = async () => {
    performerRepository.clear();
    albumRepository.clear();

    performersList = [];
    for (let i = 0; i < 3; i++) {
      const performer: PerformerEntity = await performerRepository.save({
        nombre: faker.company.name(),
        imagen: faker.image.url(),
        descripcion: faker.lorem.sentence(),
      });
      performersList.push(performer);
    }

    album = await albumRepository.save({
      nombre: faker.company.name(),
      caratula: faker.image.url(),
      fechaLanzamiento: faker.date.past(),
      descripcion: faker.lorem.sentence(),
      performers: performersList,
    });
  };

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
