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
import { AlbumService } from '../album/album.service';
import { AlbumEntity } from '../album/album.entity/album.entity';

describe('FotoService', () => {
  let service: FotoService;
  let repository: Repository<FotoEntity>;
  let albumService: AlbumService;
  let albumRepository: Repository<AlbumEntity>;
  let fotosList: FotoEntity[];

  beforeEach(async () => {
    try {
      const module: TestingModule = await Test.createTestingModule({
        imports: [...TypeOrmTestingConfig()],
        providers: [FotoService, AlbumService],
      }).compile();

      service = module.get<FotoService>(FotoService);
      repository = module.get<Repository<FotoEntity>>(
        getRepositoryToken(FotoEntity),
      );
      albumService = module.get<AlbumService>(AlbumService);
      albumRepository = module.get<Repository<AlbumEntity>>(
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
      const album: AlbumEntity = {
        id: "",
        fechaInicio: faker.date.past(), 
        fechaFin: faker.date.future(), 
        titulo: faker.lorem.text(), 
        fotos: []
      }
      const newAlbum: AlbumEntity = await albumService.createAlbum(album);
      repository.clear();
      fotosList = [];
      for (let i = 0; i < 5; i++) {
        const foto: FotoEntity = await repository.save({
          ISO: faker.number.int({min: 100, max: 6400}),
          velObturacion: faker.number.int({min: 2, max: 250}),
          apertura: faker.number.int({min: 1, max: 32}),
          fecha: faker.date.past(),
          usuario: null,
          album: newAlbum
        });
        fotosList.push(foto);
      }
    } catch (error) {
      console.error('Error during test setup:', error);
    }
  };

  //create
  it("create should return a new foto", async () => {
    const foto: FotoEntity = {
      id: "",
      ISO: faker.number.int({ min: 100, max: 3000 }),
      velObturacion: faker.number.int({ min: 2, max: 100 }),
      apertura: faker.number.int({ min: 1, max: 15 }),
      fecha: faker.date.past(),
      usuario: null,
      album: null,
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
  });

  it('create with wrong ISO, wrong valObturacion and wrong apertura should throw an exception', async () => {
    const foto: FotoEntity = {
      id: "",
      ISO: faker.number.int({ min: 6500 }),
      velObturacion: faker.number.int({ min: 260 }),
      apertura: faker.number.int({ min: 40 }),
      fecha: faker.date.past(),
      usuario: null,
      album: null,
    };

    await expect(service.createFoto(foto)).rejects.toHaveProperty("message", "El valor de ISO esta mal");


    const storedFoto: FotoEntity = await repository.findOne({
      where: { id: foto.id },
    });
    expect(storedFoto).toBeNull();
});

  //findById
  it('findFotoById should return a foto by id', async () => {
    const storedFoto: FotoEntity = fotosList[0];
    const foto: FotoEntity = await service.findFotoById(storedFoto.id);
    expect(foto).not.toBeNull();
    expect(foto.ISO).toEqual(storedFoto.ISO);
    expect(foto.velObturacion).toEqual(storedFoto.velObturacion);
    expect(foto.apertura).toEqual(storedFoto.apertura);
    expect(foto.fecha).toEqual(storedFoto.fecha);
  });

  it('findFotoById should throw an exception for an invalid foto', async () => {
    await expect(() => service.findFotoById("0")).rejects.toHaveProperty("message", "The foto with the given id was not found")
  });


  //findAll
  it('findAllFotos should return all fotos', async () => {
    const fotos: FotoEntity[] = await service.findAllFotos();
    expect(fotos).not.toBeNull();
    expect(fotos.length).toEqual(fotosList.length);
  });

  //delete
  it('delete should remove a foto', async () => {
    const foto: FotoEntity = fotosList[0];
    await service.deleteFoto(foto.id);
    const deletedfoto: FotoEntity = await repository.findOne({ where: { id: foto.id } })
    expect(deletedfoto).toBeNull();
  });

  it('delete should throw an exception for an invalid foto', async () => {
    const foto: FotoEntity = fotosList[0];
    await expect(() => service.deleteFoto("0")).rejects.toHaveProperty("message", "The foto with the given id was not found")
  });
});
