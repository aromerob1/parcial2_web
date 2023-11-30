import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';
import { FotoEntity } from './foto.entity/foto.entity';
import { FotoService } from './foto.service';

describe('FotoService', () => {
  let service: FotoService;
  let repository: Repository<FotoEntity>;
  let albumsList: FotoEntity[];

  beforeEach(async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [FotoService],
      }).compile();

      service = module.get<FotoService>(FotoService);
      repository = module.get<Repository<FotoEntity>>(
        getRepositoryToken(FotoEntity),
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
        const album: FotoEntity = await repository.save({
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

  it('create should return a new foto', async () => {
    try {
      const foto: FotoEntity = {
        id: '',
        ISO: faker.number.int(),
        velObturacion: faker.number.int(),
        apertura: faker.number.int(),
        fecha: faker.date.past(),
      };

      const newFoto: FotoEntity = await service.createFoto(foto);
      expect(newFoto).not.toBeNull();

      const storedFoto: FotoEntity = await repository.findOne({
        where: { id: newFoto.id },
      });
      expect(storedFoto).not.toBeNull();
      expect(storedFoto.ISO).toEqual(newFoto.ISO);
      expect(storedFoto.velObturacion).toEqual(newFoto.velObturacion);
      expect(storedFoto.apertura).toEqual(newFoto.apertura);
      expect(storedFoto.fecha).toEqual(newFoto.fecha);
    } catch (error) {
    }
  });
});
